import { v4 as uuidv4 } from 'uuid';
import { query, getMemoryStore, isUsingPostgres } from '../database/db.js';
import { assignModuleSchema } from '../validators/schemas.js';

export async function getModules(req, res, next) {
  try {
    const user = req.user;
    const store = getMemoryStore();

    let modules;
    if (isUsingPostgres()) {
      const result = await query('SELECT * FROM learning_modules ORDER BY module_number ASC');
      modules = result.rows;
    } else {
      modules = [...store.learning_modules].sort((a, b) => a.module_number - b.module_number);
    }

    // Attach scenario counts and learner status if learner profile is available
    const learnerId = user?.learnerProfile?.id || req.query.learner_id;
    const enriched = modules.map(m => {
      let scenarioCount = 0;
      if (isUsingPostgres()) {
        // Will be enriched or calculated
        scenarioCount = store.learning_scenarios.filter(s => s.module_id === m.id).length;
      } else {
        scenarioCount = store.learning_scenarios.filter(s => s.module_id === m.id).length;
      }

      let assignment = null;
      if (learnerId) {
        assignment = store.module_assignments.find(a => a.module_id === m.id && a.learner_id === learnerId);
      }

      return {
        ...m,
        scenarioCount,
        assignment: assignment || null
      };
    });

    res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
}

export async function getModuleById(req, res, next) {
  try {
    const { id } = req.params;
    const store = getMemoryStore();

    let moduleItem = store.learning_modules.find(m => m.id === id || String(m.module_number) === id);
    if (!moduleItem && isUsingPostgres()) {
      const resMod = await query('SELECT * FROM learning_modules WHERE id = $1', [id]);
      moduleItem = resMod.rows[0];
    }

    if (!moduleItem) {
      return res.status(404).json({
        success: false,
        message: 'Learning module not found'
      });
    }

    // Retrieve scenarios for this module with their options
    const scenarios = store.learning_scenarios
      .filter(s => s.module_id === moduleItem.id)
      .sort((a, b) => a.scenario_order - b.scenario_order)
      .map(s => {
        const options = store.scenario_options
          .filter(o => o.scenario_id === s.id)
          .sort((a, b) => a.order_index - b.order_index);
        return {
          ...s,
          options
        };
      });

    res.json({
      success: true,
      data: {
        ...moduleItem,
        scenarios
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getScenarioById(req, res, next) {
  try {
    const { id } = req.params;
    const store = getMemoryStore();

    const scenario = store.learning_scenarios.find(s => s.id === id);
    if (!scenario) {
      return res.status(404).json({
        success: false,
        message: 'Scenario not found'
      });
    }

    const options = store.scenario_options
      .filter(o => o.scenario_id === scenario.id)
      .sort((a, b) => a.order_index - b.order_index);

    const moduleInfo = store.learning_modules.find(m => m.id === scenario.module_id);

    res.json({
      success: true,
      data: {
        ...scenario,
        module: moduleInfo ? { id: moduleInfo.id, title: moduleInfo.title, module_number: moduleInfo.module_number } : null,
        options
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function assignModule(req, res, next) {
  try {
    const { id: moduleId } = req.params;
    const validated = assignModuleSchema.parse(req.body);
    const assignedBy = req.user.id;
    const store = getMemoryStore();

    // Verify module exists
    const mod = store.learning_modules.find(m => m.id === moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found' });
    }

    // Check existing assignment
    let existing = store.module_assignments.find(
      a => a.module_id === moduleId && a.learner_id === validated.learner_id
    );

    if (existing) {
      existing.repetition_count = validated.repetition_count;
      existing.difficulty_level = validated.difficulty_level;
      existing.due_date = validated.due_date || existing.due_date;
      existing.updated_at = new Date().toISOString();
      return res.json({
        success: true,
        message: 'Module assignment updated successfully',
        data: existing
      });
    }

    const assignmentId = uuidv4();
    const newAssignment = {
      id: assignmentId,
      module_id: moduleId,
      learner_id: validated.learner_id,
      assigned_by: assignedBy,
      status: 'assigned',
      repetition_count: validated.repetition_count,
      difficulty_level: validated.difficulty_level,
      due_date: validated.due_date || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.module_assignments.push(newAssignment);

    res.status(201).json({
      success: true,
      message: 'Module assigned to learner successfully',
      data: newAssignment
    });
  } catch (err) {
    next(err);
  }
}
