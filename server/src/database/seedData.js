// Realistic, trauma-informed, educational demo data for NeuroVR-2.0
// Designed specifically for learners with intellectual disabilities and visual learning needs

import bcrypt from 'bcryptjs';

export const getSeedData = () => {
  const salt = bcrypt.genSaltSync(10);
  const caregiverPasswordHash = bcrypt.hashSync('CaregiverPass123!', salt);
  const learnerPasswordHash = bcrypt.hashSync('LearnerPass123!', salt);
  const adminPasswordHash = bcrypt.hashSync('AdminPass123!', salt);

  const users = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Elena Vance (Caregiver & Educator)',
      email: 'caregiver@neurovr.org',
      password_hash: caregiverPasswordHash,
      role: 'caregiver',
      created_at: new Date('2026-01-10T09:00:00Z').toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Sammy Chen (Learner)',
      email: 'sammy@neurovr.org',
      password_hash: learnerPasswordHash,
      role: 'learner',
      created_at: new Date('2026-01-15T10:00:00Z').toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'Alex Rivera (Learner)',
      email: 'alex@neurovr.org',
      password_hash: learnerPasswordHash,
      role: 'learner',
      created_at: new Date('2026-01-20T11:00:00Z').toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      name: 'Admin Supervisor',
      email: 'admin@neurovr.org',
      password_hash: adminPasswordHash,
      role: 'admin',
      created_at: new Date('2026-01-01T08:00:00Z').toISOString()
    }
  ];

  const learner_profiles = [
    {
      id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      user_id: '22222222-2222-2222-2222-222222222222',
      preferred_name: 'Sammy',
      current_level: 'beginner',
      repetition_preference: 2,
      avatar_id: 'avatar-friendly-1',
      notes: 'Benefits from visual cues, audio captions, and encouraging repetitive reinforcement.',
      created_at: new Date('2026-01-15T10:05:00Z').toISOString()
    },
    {
      id: 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      user_id: '33333333-3333-3333-3333-333333333333',
      preferred_name: 'Alex',
      current_level: 'intermediate',
      repetition_preference: 1,
      avatar_id: 'avatar-friendly-2',
      notes: 'Enjoys 3D scene exploration and self-paced decision-making.',
      created_at: new Date('2026-01-20T11:05:00Z').toISOString()
    }
  ];

  const caregiver_learner_links = [
    {
      id: 'c1111111-cccc-cccc-cccc-cccccccccccc',
      caregiver_id: '11111111-1111-1111-1111-111111111111',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      relationship_type: 'Primary Special Educator',
      permissions: { can_assign: true, can_view_reports: true, can_configure_pace: true },
      created_at: new Date('2026-01-16T09:00:00Z').toISOString()
    },
    {
      id: 'c2222222-cccc-cccc-cccc-cccccccccccc',
      caregiver_id: '11111111-1111-1111-1111-111111111111',
      learner_id: 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      relationship_type: 'Support Coordinator',
      permissions: { can_assign: true, can_view_reports: true, can_configure_pace: true },
      created_at: new Date('2026-01-21T09:00:00Z').toISOString()
    }
  ];

  const learning_modules = [
    {
      id: 'm1111111-0001-0000-0000-000000000001',
      module_number: 1,
      title: 'Understanding Personal Boundaries',
      subtitle: 'Your Body Belongs to You',
      description: 'Learn what personal space means, how everyone has a personal comfort bubble, and that you have the right to say no anytime you feel uncomfortable.',
      icon_name: 'ShieldCheck',
      estimated_minutes: 8,
      difficulty_level: 'beginner'
    },
    {
      id: 'm2222222-0002-0000-0000-000000000002',
      module_number: 2,
      title: 'Safe and Caring Touch',
      subtitle: 'Comfort, Permission, and Respect',
      description: 'Discover how kind touches—like a high-five or a hug from a caregiver—always involve asking first and respecting whether you feel comfortable.',
      icon_name: 'HeartHandshake',
      estimated_minutes: 10,
      difficulty_level: 'beginner'
    },
    {
      id: 'm3333333-0003-0000-0000-000000000003',
      module_number: 3,
      title: 'Unsafe Touch and Warning Signs',
      subtitle: 'Protective Steps and Telling a Trusted Adult',
      description: 'Learn how to recognize uncomfortable touches, what to do immediately (Say STOP, Move away, Tell a trusted adult), and remember it is never your fault.',
      icon_name: 'AlertCircle',
      estimated_minutes: 12,
      difficulty_level: 'intermediate'
    },
    {
      id: 'm4444444-0004-0000-0000-000000000004',
      module_number: 4,
      title: 'Interactive Decision-Making',
      subtitle: 'Practicing Real Scenarios Together',
      description: 'Walk through 3D school and home situations. Choose what feels safe, and receive supportive, gentle feedback explaining every option.',
      icon_name: 'Compass',
      estimated_minutes: 12,
      difficulty_level: 'intermediate'
    },
    {
      id: 'm5555555-0005-0000-0000-000000000005',
      module_number: 5,
      title: 'Practice and Revision',
      subtitle: 'Reinforcing Safety Steps at Your Own Pace',
      description: 'Review key boundary concepts, listen to audio guidance again, and build long-term confidence with caregiver support if desired.',
      icon_name: 'RotateCcw',
      estimated_minutes: 10,
      difficulty_level: 'all_levels'
    }
  ];

  const learning_scenarios = [
    // Module 1 Scenarios
    {
      id: 's1111111-0001-0000-0000-000000000001',
      module_id: 'm1111111-0001-0000-0000-000000000001',
      scenario_order: 1,
      title: 'The Personal Comfort Bubble',
      environment_type: 'room',
      narrator_prompt: 'Imagine an invisible, friendly bubble all around you. This is your personal boundary. You get to decide who enters your bubble.',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [2.5, 0, 0],
        otherRole: 'Classmate',
        action: 'standing_friendly'
      },
      guidance_tip: 'Everyone has a personal bubble. It keeps us feeling safe and calm.'
    },
    {
      id: 's1111111-0002-0000-0000-000000000002',
      module_id: 'm1111111-0001-0000-0000-000000000001',
      scenario_order: 2,
      title: 'Someone Steps Too Close',
      environment_type: 'room',
      narrator_prompt: 'A peer stands very close to you while talking, and you feel crowded. What is a safe action you can take?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [0.8, 0, 0],
        otherRole: 'Peer',
        action: 'leaning_in'
      },
      guidance_tip: 'You are allowed to take a step back and ask for space.'
    },

    // Module 2 Scenarios
    {
      id: 's2222222-0001-0000-0000-000000000001',
      module_id: 'm2222222-0002-0000-0000-000000000002',
      scenario_order: 1,
      title: 'A Teacher Offers a High-Five',
      environment_type: 'school',
      narrator_prompt: 'You finished your puzzle! Your teacher smiles and raises their hand saying, "High-five, great work!" How do you feel, and what can you choose?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [1.8, 0, 0],
        otherRole: 'Teacher',
        action: 'raising_hand_high_five'
      },
      guidance_tip: 'A high-five is a safe celebratory touch, and you can always say "thumbs up instead" if you prefer.'
    },
    {
      id: 's2222222-0002-0000-0000-000000000002',
      module_id: 'm2222222-0002-0000-0000-000000000002',
      scenario_order: 2,
      title: 'Caregiver Asking for a Hug',
      environment_type: 'home',
      narrator_prompt: 'Your family caregiver opens their arms gently and asks, "Would you like a hug before dinner?" What is true about this touch?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [2.0, 0, 0],
        otherRole: 'Family Caregiver',
        action: 'asking_permission_open_arms'
      },
      guidance_tip: 'Safe touches always respect your permission. It is okay to say yes or no.'
    },

    // Module 3 Scenarios
    {
      id: 's3333333-0001-0000-0000-000000000001',
      module_id: 'm3333333-0003-0000-0000-000000000003',
      scenario_order: 1,
      title: 'Ignoring When You Say "Stop"',
      environment_type: 'school',
      narrator_prompt: 'Someone tickles your arm on the playground. You ask them to stop, but they keep doing it and laugh. What should you do?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [1.2, 0, 0],
        otherRole: 'Playground Visitor',
        action: 'ignoring_boundaries'
      },
      guidance_tip: 'When someone does not listen to "Stop", move to safety and find a trusted adult right away.'
    },
    {
      id: 's3333333-0002-0000-0000-000000000002',
      module_id: 'm3333333-0003-0000-0000-000000000003',
      scenario_order: 2,
      title: 'Being Asked to Keep an Uncomfortable Secret',
      environment_type: 'room',
      narrator_prompt: 'Someone touched you in a way that felt strange or uncomfortable, and said, "Do not tell anyone, it is our secret." How should you respond?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [1.5, 0, 0],
        otherRole: 'Acquaintance',
        action: 'whispering_secret'
      },
      guidance_tip: 'Safe touches are never secrets that make you feel worried or confused. Always tell a trusted adult.'
    },

    // Module 4 Scenarios
    {
      id: 's4444444-0001-0000-0000-000000000001',
      module_id: 'm4444444-0004-0000-0000-000000000004',
      scenario_order: 1,
      title: 'Decision-Making: Someone Asks for a Hug',
      environment_type: 'home',
      narrator_prompt: 'A visiting relative says, "Come here and give me a big hug!" You feel tired and do not want to be hugged right now. What can you do?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [2.2, 0, 0],
        otherRole: 'Visiting Relative',
        action: 'gesturing_for_hug'
      },
      guidance_tip: 'You always have the right to choose whether to hug or give a gentle wave instead.'
    },
    {
      id: 's4444444-0002-0000-0000-000000000002',
      module_id: 'm4444444-0004-0000-0000-000000000004',
      scenario_order: 2,
      title: 'Decision-Making: Feeling Confused About Touch',
      environment_type: 'school',
      narrator_prompt: 'Someone put their hands on your shoulders in a way that felt uncomfortable. You feel nervous. Whose fault is it?',
      character_setup: {
        learnerPosition: [0, 0, 0],
        otherPosition: [1.8, 0, 0],
        otherRole: 'Adult Helper',
        action: 'listening_supportively'
      },
      guidance_tip: 'It is NEVER your fault when someone makes you feel uncomfortable. Telling someone is brave.'
    }
  ];

  const scenario_options = [
    // Options for s1111111-0001 (Bubble)
    {
      id: 'o111-01',
      scenario_id: 's1111111-0001-0000-0000-000000000001',
      option_text: 'My comfort bubble belongs to me, and I can ask for space.',
      is_safe_action: true,
      feedback_explanation: 'Spot on! You are in charge of your personal space and boundaries.',
      encouragement_message: 'Wonderful! You understand your personal comfort bubble.',
      order_index: 1
    },
    {
      id: 'o111-02',
      scenario_id: 's1111111-0001-0000-0000-000000000001',
      option_text: 'I must let anyone enter my space even if it makes me uncomfortable.',
      is_safe_action: false,
      feedback_explanation: 'Remember, you never have to let anyone crowd you if it feels uncomfortable. You can say no.',
      encouragement_message: 'Good effort trying! Remember: your personal space belongs to you.',
      order_index: 2
    },

    // Options for s1111111-0002 (Steps too close)
    {
      id: 'o112-01',
      scenario_id: 's1111111-0002-0000-0000-000000000002',
      option_text: 'Take a step back and kindly say: "Please give me some space."',
      is_safe_action: true,
      feedback_explanation: 'Great choice! Stepping back and speaking up politely protects your comfort bubble.',
      encouragement_message: 'Excellent boundary skill! Stepping back is peaceful and safe.',
      order_index: 1
    },
    {
      id: 'o112-02',
      scenario_id: 's1111111-0002-0000-0000-000000000002',
      option_text: 'Stand still and feel unhappy without saying or doing anything.',
      is_safe_action: false,
      feedback_explanation: 'You do not have to just endure uncomfortable situations. You can step back or ask a teacher for help.',
      encouragement_message: 'It can be tricky, but you are always allowed to step back and ask for space!',
      order_index: 2
    },
    {
      id: 'o112-03',
      scenario_id: 's1111111-0002-0000-0000-000000000002',
      option_text: 'Walk over to a teacher or trusted adult if the person does not move.',
      is_safe_action: true,
      feedback_explanation: 'Very smart! Asking a trusted adult for assistance is always a safe decision.',
      encouragement_message: 'Great thinking! Trusted adults are here to support your comfort.',
      order_index: 3
    },

    // Options for s2222222-0001 (High five)
    {
      id: 'o221-01',
      scenario_id: 's2222222-0001-0000-0000-000000000001',
      option_text: 'High-five back if I feel happy and comfortable celebrating.',
      is_safe_action: true,
      feedback_explanation: 'Yes! A high-five is a safe, caring touch when both people are comfortable.',
      encouragement_message: 'Great job! Friendly gestures with mutual joy are safe and fun.',
      order_index: 1
    },
    {
      id: 'o221-02',
      scenario_id: 's2222222-0001-0000-0000-000000000001',
      option_text: 'Give a friendly wave or thumbs-up instead if I do not feel like touching hands.',
      is_safe_action: true,
      feedback_explanation: 'Awesome alternative! You can celebrate without physical touch whenever you prefer.',
      encouragement_message: 'Terrific answer! A wave or smile is a wonderful way to celebrate too.',
      order_index: 2
    },

    // Options for s2222222-0002 (Caregiver hug)
    {
      id: 'o222-01',
      scenario_id: 's2222222-0002-0000-0000-000000000002',
      option_text: 'I can say yes if I feel comfortable, or say "not right now" if I do not.',
      is_safe_action: true,
      feedback_explanation: 'Exactly right! Caring touch always respects your feelings and consent.',
      encouragement_message: 'Superb! Comfort and permission always matter, even with loved ones.',
      order_index: 1
    },
    {
      id: 'o222-02',
      scenario_id: 's2222222-0002-0000-0000-000000000002',
      option_text: 'I have to say yes to every hug no matter how I feel inside.',
      is_safe_action: false,
      feedback_explanation: 'No one has to accept a hug if they do not want one. Caring adults will always understand "not right now".',
      encouragement_message: 'Good to remember: Your feelings are always important and respected.',
      order_index: 2
    },

    // Options for s3333333-0001 (Ignoring stop)
    {
      id: 'o331-01',
      scenario_id: 's3333333-0001-0000-0000-000000000001',
      option_text: 'Say "STOP" clearly, move away, and tell a trusted adult immediately.',
      is_safe_action: true,
      feedback_explanation: 'The 3 safety steps: Say STOP, Move away, and Tell a trusted adult!',
      encouragement_message: 'Brilliant! You know the 3 safety steps: STOP, MOVE, TELL!',
      order_index: 1
    },
    {
      id: 'o331-02',
      scenario_id: 's3333333-0001-0000-0000-000000000001',
      option_text: 'Keep quiet and wait for them to get tired.',
      is_safe_action: false,
      feedback_explanation: 'If someone ignores your "Stop", do not wait in silence. Move away and get a trusted adult to help.',
      encouragement_message: 'You have the right to be heard. Moving away and getting help is the right move.',
      order_index: 2
    },

    // Options for s3333333-0002 (Secret touch)
    {
      id: 'o332-01',
      scenario_id: 's3333333-0002-0000-0000-000000000002',
      option_text: 'Tell a trusted adult right away, because safe touches are never confusing secrets.',
      is_safe_action: true,
      feedback_explanation: 'Heroic choice! Uncomfortable secrets should always be shared with a trusted adult until someone listens.',
      encouragement_message: 'Outstanding! Telling a trusted adult keeps you safe. You are never in trouble for telling.',
      order_index: 1
    },
    {
      id: 'o332-02',
      scenario_id: 's3333333-0002-0000-0000-000000000002',
      option_text: 'Keep the secret forever because they told me to.',
      is_safe_action: false,
      feedback_explanation: 'Never keep an uncomfortable secret. You will NEVER get in trouble for telling a trusted adult.',
      encouragement_message: 'Remember: You are always allowed to break a secret that makes you feel bad or confused.',
      order_index: 2
    },

    // Options for s4444444-0001 (Relative hug decision)
    {
      id: 'o441-01',
      scenario_id: 's4444444-0001-0000-0000-000000000004',
      option_text: 'Say "I would prefer a high-five or wave today, thank you!"',
      is_safe_action: true,
      feedback_explanation: 'Polite and clear! Offering a friendly non-touch greeting respects your own boundary.',
      encouragement_message: 'Fantastic communication! You can choose what feels comfortable to you.',
      order_index: 1
    },
    {
      id: 'o441-02',
      scenario_id: 's4444444-0001-0000-0000-000000000004',
      option_text: 'Say "No thank you" and stand near my caregiver.',
      is_safe_action: true,
      feedback_explanation: 'Very healthy! You can say no thank you and stay near people you trust.',
      encouragement_message: 'Great choice! Standing near your caregiver makes you feel secure.',
      order_index: 2
    },

    // Options for s4444444-0002 (Fault decision)
    {
      id: 'o442-01',
      scenario_id: 's4444444-0002-0000-0000-000000000004',
      option_text: 'It is NEVER my fault. I did nothing wrong.',
      is_safe_action: true,
      feedback_explanation: '100% true! If someone behaves inappropriately or violates boundaries, it is NEVER your fault.',
      encouragement_message: 'You got it! Always remember: it is never your fault.',
      order_index: 1
    },
    {
      id: 'o442-02',
      scenario_id: 's4444444-0002-0000-0000-000000000004',
      option_text: 'It was my fault for wearing that shirt or standing there.',
      is_safe_action: false,
      feedback_explanation: 'No! It is never your fault. What you wear or where you stand does not give anyone permission to make you feel unsafe.',
      encouragement_message: 'Take a deep breath: You are safe, and it is NEVER your fault.',
      order_index: 2
    }
  ];

  const module_assignments = [
    {
      id: 'as111111-0001-0000-0000-000000000001',
      module_id: 'm1111111-0001-0000-0000-000000000001',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      assigned_by: '11111111-1111-1111-1111-111111111111',
      status: 'completed',
      repetition_count: 2,
      difficulty_level: 'standard',
      due_date: new Date('2026-03-01T00:00:00Z').toISOString(),
      created_at: new Date('2026-01-16T10:00:00Z').toISOString(),
      updated_at: new Date('2026-01-18T11:00:00Z').toISOString()
    },
    {
      id: 'as222222-0002-0000-0000-000000000002',
      module_id: 'm2222222-0002-0000-0000-000000000002',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      assigned_by: '11111111-1111-1111-1111-111111111111',
      status: 'in_progress',
      repetition_count: 1,
      difficulty_level: 'standard',
      due_date: new Date('2026-03-05T00:00:00Z').toISOString(),
      created_at: new Date('2026-01-18T12:00:00Z').toISOString(),
      updated_at: new Date('2026-01-19T14:00:00Z').toISOString()
    },
    {
      id: 'as333333-0003-0000-0000-000000000003',
      module_id: 'm3333333-0003-0000-0000-000000000003',
      learner_id: 'b2222222-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      assigned_by: '11111111-1111-1111-1111-111111111111',
      status: 'assigned',
      repetition_count: 1,
      difficulty_level: 'standard',
      due_date: new Date('2026-03-10T00:00:00Z').toISOString(),
      created_at: new Date('2026-01-21T10:00:00Z').toISOString(),
      updated_at: new Date('2026-01-21T10:00:00Z').toISOString()
    }
  ];

  const learning_sessions = [
    {
      id: 'ses11111-0001-0000-0000-000000000001',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      module_id: 'm1111111-0001-0000-0000-000000000001',
      session_type: 'guided_lesson',
      started_at: new Date('2026-01-18T10:30:00Z').toISOString(),
      completed_at: new Date('2026-01-18T10:42:00Z').toISOString(),
      total_interactions: 4,
      assisted_by_caregiver: true
    },
    {
      id: 'ses22222-0002-0000-0000-000000000002',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      module_id: 'm2222222-0002-0000-0000-000000000002',
      session_type: 'practice',
      started_at: new Date('2026-01-19T14:10:00Z').toISOString(),
      completed_at: new Date('2026-01-19T14:22:00Z').toISOString(),
      total_interactions: 3,
      assisted_by_caregiver: false
    }
  ];

  const assessment_attempts = [
    {
      id: 'att11111-0001-0000-0000-000000000001',
      session_id: 'ses11111-0001-0000-0000-000000000001',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      module_id: 'm1111111-0001-0000-0000-000000000001',
      attempt_type: 'practice',
      score_percentage: 100.0,
      total_questions: 2,
      correct_answers: 2,
      completed_at: new Date('2026-01-18T10:42:00Z').toISOString()
    },
    {
      id: 'att22222-0002-0000-0000-000000000002',
      session_id: 'ses22222-0002-0000-0000-000000000002',
      learner_id: 'a1111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      module_id: 'm2222222-0002-0000-0000-000000000002',
      attempt_type: 'formal_assessment',
      score_percentage: 85.0,
      total_questions: 2,
      correct_answers: 2,
      completed_at: new Date('2026-01-19T14:22:00Z').toISOString()
    }
  ];

  const assessment_answers = [
    {
      id: 'ans11111-0001-0000-0000-000000000001',
      attempt_id: 'att11111-0001-0000-0000-000000000001',
      scenario_id: 's1111111-0001-0000-0000-000000000001',
      selected_option_id: 'o111-01',
      is_correct: true,
      response_time_ms: 4200,
      created_at: new Date('2026-01-18T10:35:00Z').toISOString()
    },
    {
      id: 'ans11111-0002-0000-0000-000000000002',
      attempt_id: 'att11111-0001-0000-0000-000000000001',
      scenario_id: 's1111111-0002-0000-0000-000000000002',
      selected_option_id: 'o112-01',
      is_correct: true,
      response_time_ms: 3800,
      created_at: new Date('2026-01-18T10:40:00Z').toISOString()
    }
  ];

  const accessibility_preferences = [
    {
      id: 'acc11111-0001-0000-0000-000000000001',
      user_id: '22222222-2222-2222-2222-222222222222',
      high_contrast: false,
      contrast_theme: 'normal',
      text_scale: 'large',
      tts_enabled: true,
      tts_speed: 0.9,
      captions_enabled: true,
      reduced_motion: false,
      caregiver_assistance_mode: true,
      updated_at: new Date('2026-01-15T10:10:00Z').toISOString()
    },
    {
      id: 'acc22222-0002-0000-0000-000000000002',
      user_id: '33333333-3333-3333-3333-333333333333',
      high_contrast: true,
      contrast_theme: 'high_contrast_dark',
      text_scale: 'normal',
      tts_enabled: true,
      tts_speed: 1.0,
      captions_enabled: true,
      reduced_motion: true,
      caregiver_assistance_mode: false,
      updated_at: new Date('2026-01-20T11:10:00Z').toISOString()
    }
  ];

  return {
    users,
    learner_profiles,
    caregiver_learner_links,
    learning_modules,
    learning_scenarios,
    scenario_options,
    module_assignments,
    learning_sessions,
    assessment_attempts,
    assessment_answers,
    accessibility_preferences
  };
};
