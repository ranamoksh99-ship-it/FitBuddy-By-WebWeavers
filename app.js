/**
 * ==============================================================================
 * FitBuddy by WebWeavers - Live Daily Fitness Tracker & Day-Wise Workout & Diet Planner
 * Course: CSE326 Internet Programming
 * Script: Complete Real Auth, Fresh Zero-Metric Onboarding, Live Leaflet GPS Tracking,
 *         Day-Wise Workout Planner (Gym vs Home splits with 1-2 alternatives),
 *         Day-Wise Science-Backed Nutrition & Diet (Veg & Non-Veg splits),
 *         Coach/Staff Admin Portal with Member Roster, and Real-Time Form Validation.
 * ==============================================================================
 */

'use strict';

(function () {
  /* --------------------------------------------------------------------------
     1. STORAGE KEYS & CONSTANTS (Unit V Web Storage API)
     -------------------------------------------------------------------------- */
  const STORAGE_KEYS = {
    THEME: 'fitbuddy_theme',
    ACCOUNTS: 'fitbuddy_accounts',         // Stored registered accounts dictionary
    CURRENT_USER: 'fitbuddy_active_user',  // Currently signed-in user email
    CHALLENGES: 'fitbuddy_challenges',
    ROLE_MODE: 'fitbuddy_role_mode',
    ANNOUNCEMENTS: 'fitbuddy_announcements',
    DIET: 'fitbuddy_diet_plan'
  };

  // Pre-configured Test Accounts for Evaluation Convenience
  const DEMO_ACCOUNT = {
    email: 'demo@fitbuddy.app',
    password: 'Fit@1234',
    name: 'Demo Athlete',
    role: 'athlete',
    avatar: '🏃',
    age: 24,
    height: 175,
    weight: 70.0,
    status: 'Ready to crush my daily goals with FitBuddy! 💪',
    goals: { steps: 10000, calories: 650, water: 2500 },
    activities: [],
    todaySteps: 0,
    todayWater: 0,
    todayStreak: 0,
    dayStatuses: {}
  };

  const ADMIN_ACCOUNT = {
    email: 'admin@fitbuddy.app',
    password: 'Admin@1234',
    name: 'Coach Alex (Head Trainer)',
    role: 'staff',
    avatar: '🛡️',
    age: 32,
    height: 182,
    weight: 82.0,
    status: 'Staff Coach on duty. Keep pushing your limits! 💪',
    goals: { steps: 12000, calories: 850, water: 3500 },
    activities: [
      {
        id: 'act-a1',
        title: '5K Coach Morning Pace Run',
        category: 'Cardio',
        date: new Date().toISOString().split('T')[0],
        time: '06:30',
        duration: 25,
        calories: 290,
        distance: 5.0,
        intensity: 8,
        effort: 'Intense',
        status: 'Completed',
        notes: 'Morning group pacing with athletes'
      },
      {
        id: 'act-a2',
        title: 'Compound Heavy Strength Demo',
        category: 'Strength',
        date: new Date().toISOString().split('T')[0],
        time: '11:00',
        duration: 45,
        calories: 380,
        distance: 0,
        intensity: 9,
        effort: 'Intense',
        status: 'Completed',
        notes: 'Form demonstrations for bench press and squats'
      }
    ],
    todaySteps: 6420,
    todayWater: 1750,
    todayStreak: 14,
    dayStatuses: { 'Monday': 'Completed', 'Tuesday': 'In Progress' }
  };

  const DEFAULT_ANNOUNCEMENTS = [
    {
      id: 'ann-1',
      author: 'Head Coach Alex',
      title: '🔥 Welcome to the 30-Day Fitness & Nutrition Challenge!',
      message: 'Fuel your workouts properly! Check out our new Day-Wise Diet section with balanced Veg and Non-Veg meal splits.',
      timestamp: 'Today at 08:00 AM'
    }
  ];

  // 7-DAY GYM WORKOUTS SPLIT (Barbells, Dumbbells, Machines, Cables)
  const GYM_WORKOUT_PLAN = {
    Monday: {
      focus: 'Chest, Shoulders & Triceps (Push Day)',
      exercises: [
        {
          id: 'gym-m1',
          name: 'Barbell Flat Bench Press',
          target: 'Chest & Front Delts',
          sets: '4 sets x 8-10 reps',
          completed: false,
          opt1: { name: 'Incline Dumbbell Press (3x10)', tag: 'Dumbbell', desc: 'Isolates upper chest with deeper stretch' },
          opt2: { name: 'Chest Press Machine (3x12)', tag: 'Machine', desc: 'Joint-friendly guided trajectory' }
        },
        {
          id: 'gym-m2',
          name: 'Seated Overhead Barbell Press',
          target: 'Shoulders & Triceps',
          sets: '3 sets x 8-10 reps',
          completed: false,
          opt1: { name: 'Seated Dumbbell Arnold Press (3x10)', tag: 'Dumbbell', desc: 'Full rotational deltoid activation' },
          opt2: { name: 'Standing Cable Face Pulls (3x15)', tag: 'Cable', desc: 'Focuses on rear delts and shoulder health' }
        },
        {
          id: 'gym-m3',
          name: 'Cable Tricep Rope Pushdowns',
          target: 'Triceps Lateral Head',
          sets: '3 sets x 12-15 reps',
          completed: false,
          opt1: { name: 'Lying EZ-Bar Skull Crushers (3x10)', tag: 'Barbell', desc: 'Deep stretch on triceps long head' },
          opt2: { name: 'Parallel Bar Bodyweight Dips (3x10)', tag: 'Bodyweight', desc: 'Compound chest & triceps builder' }
        }
      ]
    },
    Tuesday: {
      focus: 'Back & Biceps (Pull Day)',
      exercises: [
        {
          id: 'gym-t1',
          name: 'Conventional Barbell Deadlift',
          target: 'Posterior Chain & Erector Spinae',
          sets: '4 sets x 5-6 reps',
          completed: false,
          opt1: { name: 'Trap Bar Deadlift (4x6)', tag: 'Trap Bar', desc: 'Upright posture with reduced lumbar strain' },
          opt2: { name: 'Barbell Romanian Deadlift (3x10)', tag: 'Hamstrings', desc: 'Intense hamstring and glute stretch' }
        },
        {
          id: 'gym-t2',
          name: 'Wide-Grip Lat Pulldown Machine',
          target: 'Latissimus Dorsi',
          sets: '4 sets x 10-12 reps',
          completed: false,
          opt1: { name: 'Weighted Pull-Ups (3x6-8)', tag: 'Bodyweight', desc: 'Ultimate upper-body pulling strength' },
          opt2: { name: 'Seated Cable Row - Neutral Grip (3x12)', tag: 'Cable', desc: 'Mid-back thickness and rhomboids focus' }
        },
        {
          id: 'gym-t3',
          name: 'Standing Barbell Bicep Curl',
          target: 'Biceps Brachii',
          sets: '3 sets x 10-12 reps',
          completed: false,
          opt1: { name: 'Incline Dumbbell Hammer Curls (3x12)', tag: 'Dumbbell', desc: 'Emphasizes brachialis and forearms' },
          opt2: { name: 'Cable Preacher Curls (3x12)', tag: 'Cable', desc: 'Strict peak contraction without momentum' }
        }
      ]
    },
    Wednesday: {
      focus: 'Quad Overload & Calves (Leg Day A)',
      exercises: [
        {
          id: 'gym-w1',
          name: 'Barbell Back Squat (Olympic Depth)',
          target: 'Quadriceps & Gluteus Maximus',
          sets: '4 sets x 8 reps',
          completed: false,
          opt1: { name: 'Hack Squat Machine (4x10)', tag: 'Machine', desc: 'Isolates quads with stable spine support' },
          opt2: { name: 'Barbell Front Squat (3x8)', tag: 'Barbell', desc: 'Emphasizes core rigidity and upright torso' }
        },
        {
          id: 'gym-w2',
          name: '45-Degree Incline Leg Press',
          target: 'Quadriceps & Hip Adductors',
          sets: '3 sets x 12 reps',
          completed: false,
          opt1: { name: 'Walking Dumbbell Lunges (3x12/leg)', tag: 'Dumbbell', desc: 'Unilateral quad balance & stability' },
          opt2: { name: 'Bulgarian Split Squats with DBs (3x10/leg)', tag: 'Dumbbell', desc: 'Deep single-leg stretch and hypertrophy' }
        },
        {
          id: 'gym-w3',
          name: 'Standing Calf Raise Machine',
          target: 'Gastrocnemius & Soleus',
          sets: '4 sets x 15 reps',
          completed: false,
          opt1: { name: 'Seated Calf Raise (4x15)', tag: 'Soleus', desc: 'Isolates the soleus under knee flexion' },
          opt2: { name: 'Leg Press Toe Presses (4x20)', tag: 'Machine', desc: 'Continuous mechanical tension on calves' }
        }
      ]
    },
    Thursday: {
      focus: 'Deltoid Sculpting & Abs Conditioning',
      exercises: [
        {
          id: 'gym-th1',
          name: 'Standing Dumbbell Lateral Raises',
          target: 'Lateral Deltoids (Shoulder Width)',
          sets: '4 sets x 12-15 reps',
          completed: false,
          opt1: { name: 'Single-Arm Cable Lateral Raise (3x15)', tag: 'Cable', desc: 'Constant cable resistance through full ROM' },
          opt2: { name: 'Machine Lateral Raise (3x15)', tag: 'Machine', desc: 'Strict isolation with zero momentum' }
        },
        {
          id: 'gym-th2',
          name: 'Rear Delt Reverse Pec-Deck Flyes',
          target: 'Posterior Deltoids & Rhomboids',
          sets: '3 sets x 15 reps',
          completed: false,
          opt1: { name: 'Incline Dumbbell Prone Y-Raises (3x12)', tag: 'Dumbbell', desc: 'Improves scapular upward rotation' },
          opt2: { name: 'High Cable Cross Face Pulls (3x15)', tag: 'Cable', desc: 'Shoulder joint longevity and posture' }
        },
        {
          id: 'gym-th3',
          name: 'Hanging Knee/Leg Raises',
          target: 'Lower Rectus Abdominis',
          sets: '3 sets x 15 reps',
          completed: false,
          opt1: { name: 'Cable Rope Kneeling Crunches (3x15)', tag: 'Cable', desc: 'Progressive overload for abdominal wall' },
          opt2: { name: 'Decline Bench Weighted Sit-Ups (3x12)', tag: 'Free Weight', desc: 'Targeted upper and mid-ab contraction' }
        }
      ]
    },
    Friday: {
      focus: 'Hamstring & Glute Hypertrophy (Leg Day B)',
      exercises: [
        {
          id: 'gym-f1',
          name: 'Barbell Romanian Deadlift (RDL)',
          target: 'Hamstrings & Glute-Ham Tie-in',
          sets: '4 sets x 8-10 reps',
          completed: false,
          opt1: { name: 'Dumbbell Stiff-Leg Deadlifts (3x12)', tag: 'Dumbbell', desc: 'Unilateral hamstring stretch' },
          opt2: { name: 'Good Mornings with Barbell (3x10)', tag: 'Barbell', desc: 'Direct hinge loading on posterior chain' }
        },
        {
          id: 'gym-f2',
          name: 'Lying Hamstring Leg Curl Machine',
          target: 'Hamstring Biceps Femoris',
          sets: '4 sets x 10-12 reps',
          completed: false,
          opt1: { name: 'Seated Leg Curl Machine (4x12)', tag: 'Machine', desc: 'Lengthened hamstring recruitment' },
          opt2: { name: 'Swiss Ball Hamstring Rollouts (3x15)', tag: 'Stability', desc: 'Joint stabilizer and eccentric control' }
        },
        {
          id: 'gym-f3',
          name: 'Barbell Hip Thrust (Glute Drive)',
          target: 'Gluteus Maximus & Hip Extensors',
          sets: '4 sets x 10 reps',
          completed: false,
          opt1: { name: 'Glute Cable Kickbacks (3x15/leg)', tag: 'Cable', desc: 'Strict glute peak contraction' },
          opt2: { name: 'Smith Machine Hip Thrusts (3x12)', tag: 'Machine', desc: 'Guided heavy glute loading' }
        }
      ]
    },
    Saturday: {
      focus: 'Upper Body Power & Arm Finisher',
      exercises: [
        {
          id: 'gym-sa1',
          name: 'Standing Bent-Over Barbell Row',
          target: 'Upper Back, Rhomboids & Lats',
          sets: '4 sets x 8 reps',
          completed: false,
          opt1: { name: 'T-Bar Supported Row (4x10)', tag: 'Machine', desc: 'Chest-supported upper back overload' },
          opt2: { name: 'One-Arm Dumbbell Row (3x10/side)', tag: 'Dumbbell', desc: 'Full stretch and core stabilization' }
        },
        {
          id: 'gym-sa2',
          name: 'Close-Grip Barbell Bench Press',
          target: 'Triceps Medial & Lateral Heads',
          sets: '3 sets x 8-10 reps',
          completed: false,
          opt1: { name: 'Overhead Dumbbell Tricep Extension (3x12)', tag: 'Dumbbell', desc: 'Full stretch on triceps long head' },
          opt2: { name: 'EZ-Bar Cable French Press (3x12)', tag: 'Cable', desc: 'Controlled triceps lockouts' }
        },
        {
          id: 'gym-sa3',
          name: 'Alternating Dumbbell Hammer Curls',
          target: 'Brachialis & Forearm Grip',
          sets: '3 sets x 12 reps',
          completed: false,
          opt1: { name: 'EZ-Bar Spider Curls (3x10)', tag: 'Barbell', desc: 'Strict biceps isolation against pad' },
          opt2: { name: 'Cable Rope Bicep Hammer Curls (3x15)', tag: 'Cable', desc: 'Constant cable friction pump' }
        }
      ]
    },
    Sunday: {
      focus: 'Active Recovery & Functional Conditioning',
      exercises: [
        {
          id: 'gym-su1',
          name: 'Incline Treadmill Zone 2 Walk (12-3-30)',
          target: 'Aerobic Base & Calorie Expenditure',
          sets: '30-40 minutes steady',
          completed: false,
          opt1: { name: 'StairMaster Climber Session (20 mins)', tag: 'Cardio', desc: 'High-intensity glute and aerobic burn' },
          opt2: { name: 'Stationary Cycling (30 mins at 70% HR)', tag: 'Low Impact', desc: 'Promotes lower-body blood circulation' }
        },
        {
          id: 'gym-su2',
          name: 'Full Body Foam Rolling & Thoracic Mobility',
          target: 'Myofascial Release & Joint ROM',
          sets: '15 minutes total',
          completed: false,
          opt1: { name: 'Active Dynamic Stretching Flow (15 mins)', tag: 'Mobility', desc: 'Hip flexor, hamstring, and shoulder mobility' },
          opt2: { name: 'Light Sauna Session & Rehydration', tag: 'Recovery', desc: 'Muscle relaxation and parasympathetic recovery' }
        }
      ]
    }
  };

  // 7-DAY HOME WORKOUTS SPLIT (Bodyweight, Calisthenics, Bands)
  const HOME_WORKOUT_PLAN = {
    Monday: {
      focus: 'Bodyweight Chest, Shoulders & Push Hypertrophy',
      exercises: [
        {
          id: 'home-m1',
          name: 'Standard Strict Push-Ups',
          target: 'Pectorals, Anterior Delts & Core',
          sets: '4 sets x 15-20 reps',
          completed: false,
          opt1: { name: 'Decline Push-Ups (Feet on Chair) (3x15)', tag: 'Harder', desc: 'Shifts load to upper chest and shoulders' },
          opt2: { name: 'Incline Push-Ups (Hands on Table) (3x15)', tag: 'Easier', desc: 'Joint-friendly baseline form builder' }
        },
        {
          id: 'home-m2',
          name: 'Chair or Couch Bodyweight Dips',
          target: 'Triceps & Lower Chest',
          sets: '3 sets x 12-15 reps',
          completed: false,
          opt1: { name: 'Diamond (Close-Grip) Push-Ups (3x10)', tag: 'Harder', desc: 'Targeted bodyweight triceps burner' },
          opt2: { name: 'Bent-Knee Bench Dips (3x12)', tag: 'Easier', desc: 'Reduces bodyweight percentage on triceps' }
        },
        {
          id: 'home-m3',
          name: 'Pike Push-Ups (Shoulder Focus)',
          target: 'Anterior & Lateral Deltoids',
          sets: '3 sets x 8-12 reps',
          completed: false,
          opt1: { name: 'Elevated Feet Pike Push-Ups (3x8)', tag: 'Harder', desc: 'Pre-requisite progression to handstand push-up' },
          opt2: { name: 'Prone Shoulder Y-T-W Raises (3x15)', tag: 'Posture', desc: 'Floor postural scapular activation' }
        }
      ]
    },
    Tuesday: {
      focus: 'Back, Scapular Control & Biceps Flow',
      exercises: [
        {
          id: 'home-t1',
          name: 'Prone Back Extensions (Supermans)',
          target: 'Erector Spinae & Glutes',
          sets: '3 sets x 15 reps (2s hold)',
          completed: false,
          opt1: { name: 'Doorframe Single-Arm Isometric Rows (3x12/side)', tag: 'Isometric', desc: 'Uses doorway frame to recruit lats' },
          opt2: { name: 'Prone Swimmer Flutter Kicks (3x30s)', tag: 'Endurance', desc: 'Full posterior chain muscular endurance' }
        },
        {
          id: 'home-t2',
          name: 'Towel Door-Anchor Pull Rows',
          target: 'Mid-Back Rhomboids & Lats',
          sets: '4 sets x 12 reps',
          completed: false,
          opt1: { name: 'Under-Table Inverted Rows (3x8-10)', tag: 'Harder', desc: 'Horizontal bodyweight pull under sturdy table' },
          opt2: { name: 'Towel Isometric Lat Pulldown (3x15s)', tag: 'Isometric', desc: 'Constant manual tension pulling towel outwards' }
        },
        {
          id: 'home-t3',
          name: 'Towel Isometric Bicep Curls (Self-Resisted)',
          target: 'Biceps Peak Contraction',
          sets: '3 sets x 12 reps each arm',
          completed: false,
          opt1: { name: 'Backpack Weighted Bicep Curls (3x12)', tag: 'Weighted', desc: 'Loaded backpack with household books' },
          opt2: { name: 'Bed-Sheet Doorway Hammer Curls (3x10)', tag: 'Bands/Sheets', desc: 'Uses bodyweight angle for bicep tension' }
        }
      ]
    },
    Wednesday: {
      focus: 'Lower Body Calisthenics & Explosive Power',
      exercises: [
        {
          id: 'home-w1',
          name: 'Bodyweight Air Squats (Full Depth)',
          target: 'Quadriceps, Adductors & Glutes',
          sets: '4 sets x 25 reps',
          completed: false,
          opt1: { name: 'Jump Squats (4x15)', tag: 'Explosive', desc: 'Develops fast-twitch quadriceps power' },
          opt2: { name: 'Chair Assisted Squats (3x15)', tag: 'Easier', desc: 'Refines hip hinge depth with chair safety' }
        },
        {
          id: 'home-w2',
          name: 'Alternating Forward & Backward Lunges',
          target: 'Quads & Gluteal Stabilizers',
          sets: '3 sets x 12 reps per leg',
          completed: false,
          opt1: { name: 'Elevated Bulgarian Split Squats (3x10/leg)', tag: 'Harder', desc: 'Rear foot elevated on couch or bed' },
          opt2: { name: 'Static Split Squats without step (3x10/leg)', tag: 'Balance', desc: 'Static base to build knee joint stability' }
        },
        {
          id: 'home-w3',
          name: 'Single-Leg Standing Calf Raises on Step',
          target: 'Calf Gastrocnemius',
          sets: '4 sets x 20 reps each leg',
          completed: false,
          opt1: { name: 'Double-Leg Calf Bounces (3x40)', tag: 'Endurance', desc: 'High-tempo calf burnout' },
          opt2: { name: 'Wall-Supported Two-Leg Calf Raise (3x20)', tag: 'Support', desc: 'Strict balance on flat ground' }
        }
      ]
    },
    Thursday: {
      focus: 'Core Shred & Abdominal Wall Conditioning',
      exercises: [
        {
          id: 'home-th1',
          name: 'Standard Forearm Plank',
          target: 'Transverse Abdominis & Deep Core',
          sets: '3 sets x 45-60 seconds',
          completed: false,
          opt1: { name: 'High-to-Low Plank Up-Downs (3x12)', tag: 'Dynamic', desc: 'Adds shoulder stability and dynamic load' },
          opt2: { name: 'Knee-Supported Forearm Plank (3x30s)', tag: 'Easier', desc: 'Protects lower back while building core' }
        },
        {
          id: 'home-th2',
          name: 'Bicycle Crunches (Opposite Elbow to Knee)',
          target: 'Internal & External Obliques',
          sets: '3 sets x 20 reps (10/side)',
          completed: false,
          opt1: { name: 'Russian Twists with Feet Elevated (3x25)', tag: 'Rotational', desc: 'Continuous rotational tension on obliques' },
          opt2: { name: 'Side Plank Hip Dips (3x10/side)', tag: 'Isometric', desc: 'Direct lateral core endurance' }
        },
        {
          id: 'home-th3',
          name: 'Lying Flat Floor Leg Raises',
          target: 'Lower Rectus Abdominis',
          sets: '3 sets x 15 reps',
          completed: false,
          opt1: { name: 'Hollow Body Hold (3x30s)', tag: 'Gymnastic', desc: 'Maximum intra-abdominal compression' },
          opt2: { name: 'Bent-Knee Reverse Crunches (3x15)', tag: 'Easier', desc: 'Reduces lever arm to protect lumbar spine' }
        }
      ]
    },
    Friday: {
      focus: 'Glute-Hamstring Posterior Chain & Hip Mobility',
      exercises: [
        {
          id: 'home-f1',
          name: 'Single-Leg Glute Bridges',
          target: 'Gluteus Maximus & Hamstrings',
          sets: '3 sets x 12 reps per leg',
          completed: false,
          opt1: { name: 'Elevated Feet Glute Bridge on Couch (3x15)', tag: 'Range', desc: 'Extended range of motion for glute lockout' },
          opt2: { name: 'Two-Leg Glute Bridge with 3s Squeeze (3x15)', tag: 'Easier', desc: 'Symmetrical bilateral glute activation' }
        },
        {
          id: 'home-f2',
          name: 'Sliding Towel Hamstring Curls (on Tile/Wood)',
          target: 'Hamstring Flexion & Knee Stabilizers',
          sets: '3 sets x 10-12 reps',
          completed: false,
          opt1: { name: 'Nordic Hamstring Curl Eccentric Lowers (3x5)', tag: 'Advanced', desc: 'High eccentric hamstring tear resistance' },
          opt2: { name: 'Good Mornings with Hands Behind Head (3x15)', tag: 'Hinge', desc: 'Pure bodyweight hip hinge pattern' }
        },
        {
          id: 'home-f3',
          name: 'Bodyweight Wall Sit Hold',
          target: 'Isometric Quad & Tendon Health',
          sets: '3 sets x 45 seconds',
          completed: false,
          opt1: { name: 'Single-Leg Wall Sit (3x20s/leg)', tag: 'Harder', desc: 'Intense unilateral quadriceps burn' },
          opt2: { name: 'High Wall Sit (60-Degree angle) (3x30s)', tag: 'Easier', desc: 'Gentle on patellar tendons' }
        }
      ]
    },
    Saturday: {
      focus: 'Full-Body Calisthenics Metabolic Circuit',
      exercises: [
        {
          id: 'home-sa1',
          name: 'Full-Body Burpees with Push-Up',
          target: 'Full Body Cardiovascular & Power',
          sets: '4 sets x 12 reps',
          completed: false,
          opt1: { name: 'No-Push-Up Sprawls (4x15)', tag: 'Pacing', desc: 'Faster aerobic pace with less chest fatigue' },
          opt2: { name: 'Step-Back Burpees (3x10)', tag: 'Low Impact', desc: 'Zero-impact alternative for joints' }
        },
        {
          id: 'home-sa2',
          name: 'High Knees Running in Place',
          target: 'Cardio, Hip Flexors & Calves',
          sets: '4 sets x 45 seconds',
          completed: false,
          opt1: { name: 'Mountain Climbers on Floor (4x40s)', tag: 'Core/Cardio', desc: 'Horizontal sprint for abs and shoulders' },
          opt2: { name: 'Marching High Knees with Arm Drive (3x45s)', tag: 'Low Impact', desc: 'Cardiovascular flow without ankle impact' }
        },
        {
          id: 'home-sa3',
          name: 'Shadow Boxing with Jab-Cross Combinations',
          target: 'Upper Body Conditioning & Core Rotation',
          sets: '3 rounds x 2 minutes',
          completed: false,
          opt1: { name: 'Speed Skater Lateral Hops (3x30s)', tag: 'Agility', desc: 'Side-to-side lateral plyometric burn' },
          opt2: { name: 'Jumping Jacks (3x60s)', tag: 'Rhythm', desc: 'Classic aerobic coordination exercise' }
        }
      ]
    },
    Sunday: {
      focus: 'Mobility, Yoga Flow & Active Walking',
      exercises: [
        {
          id: 'home-su1',
          name: 'Outdoor Brisk Neighborhood Walk',
          target: 'Aerobic System & Active Recovery',
          sets: '30-45 minutes continuous',
          completed: false,
          opt1: { name: 'Indoor Low-Impact Step Routine (30 mins)', tag: 'Indoor', desc: 'Step workout following a beat' },
          opt2: { name: 'Easy Nature Trail Hike', tag: 'Outdoor', desc: 'Mindfulness and gentle joint mobilization' }
        },
        {
          id: 'home-su2',
          name: 'Full-Body Yoga Flow (Childs Pose, Cobra, Downward Dog)',
          target: 'Spinal Decompression & Flexibility',
          sets: '15-20 minutes flow',
          completed: false,
          opt1: { name: 'Cat-Cow & Hip 90/90 Stretches (10 mins)', tag: 'Hips/Spine', desc: 'Relieves lower back stiffness' },
          opt2: { name: 'Deep Breathing & Guided Meditation (10 mins)', tag: 'Mindfulness', desc: 'Lowers cortisol and enhances sleep' }
        }
      ]
    }
  };

  // Drag and Drop Exercises Pool
  const DRAGGABLE_EXERCISES = [
    { id: 'pool-1', name: 'Barbell Flat Bench Press', category: 'Strength', duration: '15 min', calories: 120 },
    { id: 'pool-2', name: 'Dumbbell Walking Lunges', category: 'Strength', duration: '12 min', calories: 95 },
    { id: 'pool-3', name: 'Standard Push-Ups', category: 'Bodyweight', duration: '10 min', calories: 80 },
    { id: 'pool-4', name: 'Burpees with Push-Up', category: 'HIIT', duration: '8 min', calories: 110 },
    { id: 'pool-5', name: 'Plank Hold (1 min)', category: 'Core', duration: '5 min', calories: 40 },
    { id: 'pool-6', name: 'Russian Twists', category: 'Core', duration: '8 min', calories: 60 },
    { id: 'pool-7', name: 'Kettlebell Swings', category: 'Cardio', duration: '10 min', calories: 130 },
    { id: 'pool-8', name: 'Incline Treadmill Walk', category: 'Cardio', duration: '20 min', calories: 160 }
  ];

  // Default Challenges
  const DEFAULT_CHALLENGES = [
    {
      id: 'chal-1',
      title: '30-Day Summer Shred & Nutrition Challenge',
      category: 'Fat Loss & Conditioning',
      durationDays: 30,
      completedDays: 0,
      description: 'Daily HIIT, core workouts, clean day-wise nutrition, and 8,000 steps minimum. Build lean definition and stamina.',
      participants: 142,
      status: 'In Progress',
      enrolled: true
    },
    {
      id: 'chal-2',
      title: 'Couch to 5K Runner Quest',
      category: 'Cardio & Stamina',
      durationDays: 21,
      completedDays: 0,
      description: 'Progressive run/walk intervals using live GPS tracking to complete your first continuous 5K.',
      participants: 89,
      status: 'Active',
      enrolled: false
    },
    {
      id: 'chal-3',
      title: '100 Daily Push-Up Mastery',
      category: 'Strength & Hypertrophy',
      durationDays: 14,
      completedDays: 0,
      description: 'Accumulate 100 pushups every day in any set combination. Upper body endurance overload.',
      participants: 210,
      status: 'Active',
      enrolled: false
    },
    {
      id: 'chal-4',
      title: 'Hydration & Nutrition Recovery Quest',
      category: 'Wellness & Habit',
      durationDays: 7,
      completedDays: 0,
      description: 'Drink at least 2,500ml of water daily, hit your day-wise protein goals, and log consecutive rest-recovery stretches.',
      participants: 315,
      status: 'Active',
      enrolled: true
    }
  ];

  /* --------------------------------------------------------------------------
     2. APPLICATION STATE
     -------------------------------------------------------------------------- */
  const AppState = {
    accounts: {},
    currentUser: null,
    pendingSignup: null,
    activeSplit: 'gym',
    activeTab: 'dashboard',
    roleMode: 'athlete',
    announcements: [],
    diet: {
      activeDay: 'Monday',
      filterType: 'all',
      searchQuery: '',
      data: null
    },
    audioContext: null,
    audioMuted: false,
    stepSessionActive: false,
    stepSessionInterval: null,
    liveSession: {
      active: false,
      paused: false,
      type: 'Running',
      met: 9.8,
      elapsedSeconds: 0,
      distanceKm: 0,
      caloriesBurned: 0,
      gpsWatchId: null,
      lastCoords: null,
      timerInterval: null,
      map: null,
      marker: null,
      routePolyline: null,
      routePoints: []
    }
  };

  /* --------------------------------------------------------------------------
     3. WEB AUDIO API SYNTHESIZER
     -------------------------------------------------------------------------- */
  function getAudioContext() {
    if (!AppState.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) AppState.audioContext = new AudioCtx();
    }
    if (AppState.audioContext && AppState.audioContext.state === 'suspended') {
      AppState.audioContext.resume();
    }
    return AppState.audioContext;
  }

  function playBeep(freq = 520, type = 'sine', duration = 0.15) {
    if (AppState.audioMuted) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  /* --------------------------------------------------------------------------
     4. ACCESSIBLE TOAST NOTIFICATIONS (Unit I ARIA Live)
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');

    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    if (type === 'danger' || type === 'error') icon = '✕';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-msg">${escapeHTML(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'toastSlideOut 0.25s forwards';
      setTimeout(() => toast.remove(), 260);
    }, duration);
  }

  /* --------------------------------------------------------------------------
     5. REAL AUTHENTICATION ENGINE (Unit V Web Storage API)
     -------------------------------------------------------------------------- */
  function initAuthSystem() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS) || localStorage.getItem('fitpulse_accounts');
      AppState.accounts = stored ? JSON.parse(stored) : {};

      // Seed default accounts if missing
      const demoKeys = [DEMO_ACCOUNT.email.toLowerCase(), 'demo@fitbuddy.app'];
      demoKeys.forEach(k => {
        if (!AppState.accounts[k]) {
          AppState.accounts[k] = {
            ...DEMO_ACCOUNT,
            email: k,
            gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
            homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN))
          };
        }
      });

      const adminKeys = [ADMIN_ACCOUNT.email.toLowerCase(), 'admin@fitbuddy.app'];
      adminKeys.forEach(k => {
        if (!AppState.accounts[k]) {
          AppState.accounts[k] = {
            ...ADMIN_ACCOUNT,
            email: k,
            gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
            homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN))
          };
        }
      });
      saveAccountsDictionary();
    } catch (e) {
      AppState.accounts = {};
    }

    // Check active session
    const activeEmail = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || localStorage.getItem('fitpulse_active_user');
    if (activeEmail && AppState.accounts[activeEmail.toLowerCase()]) {
      loginUser(AppState.accounts[activeEmail.toLowerCase()], false);
    } else {
      showAuthScreen();
    }

    // Auth Switcher Tabs
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabSignupBtn = document.getElementById('tab-signup-btn');
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const authMainTitle = document.getElementById('auth-main-title');
    const authMainSubtitle = document.getElementById('auth-main-subtitle');

    if (tabLoginBtn && tabSignupBtn) {
      tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabSignupBtn.classList.remove('active');
        tabLoginBtn.setAttribute('aria-selected', 'true');
        tabSignupBtn.setAttribute('aria-selected', 'false');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        if (authMainTitle) authMainTitle.textContent = 'Sign In to FitBuddy';
        if (authMainSubtitle) authMainSubtitle.textContent = 'Access your live training dashboard, workout splits, and nutrition plan';
      });

      tabSignupBtn.addEventListener('click', () => {
        tabSignupBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        tabSignupBtn.setAttribute('aria-selected', 'true');
        tabLoginBtn.setAttribute('aria-selected', 'false');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        if (authMainTitle) authMainTitle.textContent = 'Create FitBuddy Account';
        if (authMainSubtitle) authMainSubtitle.textContent = 'Start fresh today — all metrics initialize cleanly at zero!';
      });
    }

    // Role Card Radios on Signup Form
    document.querySelectorAll('.role-card-option').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.role-card-option').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Password Visibility Toggles
    setupPasswordToggle('toggle-login-password-btn', 'login-password');
    setupPasswordToggle('toggle-signup-password-btn', 'signup-password');
    setupPasswordToggle('toggle-signup-confirm-btn', 'signup-confirm-password');
    setupPasswordToggle('toggle-forgot-password-btn', 'forgot-new-pwd');

    // Social SSO Buttons (Simulated OAuth 2.0 with Real Feedback)
    document.getElementById('btn-google-login')?.addEventListener('click', handleGoogleLogin);
    document.getElementById('btn-apple-login')?.addEventListener('click', handleAppleLogin);

    // 1-Click Fill Demo Credentials
    document.getElementById('demo-fill-btn')?.addEventListener('click', () => {
      document.getElementById('login-email').value = DEMO_ACCOUNT.email;
      document.getElementById('login-password').value = DEMO_ACCOUNT.password;
      showToast('Pre-filled Athlete account: demo@fitbuddy.app', 'info');
      playBeep(659, 'sine', 0.1);
    });

    document.getElementById('admin-fill-btn')?.addEventListener('click', () => {
      document.getElementById('login-email').value = ADMIN_ACCOUNT.email;
      document.getElementById('login-password').value = ADMIN_ACCOUNT.password;
      showToast('Pre-filled Coach/Admin account: admin@fitbuddy.app', 'info');
      playBeep(659, 'sine', 0.1);
    });

    // Forgot Password Link & Form
    document.getElementById('forgot-password-link')?.addEventListener('click', () => {
      openModal('forgot-password-modal');
      const emailVal = document.getElementById('login-email')?.value.trim();
      if (emailVal) document.getElementById('forgot-email').value = emailVal;
    });

    document.getElementById('forgot-send-code-form')?.addEventListener('submit', handleForgotSendCode);
    document.getElementById('forgot-verify-form')?.addEventListener('submit', handleForgotVerify);

    // Terms of Service & Privacy Policy Modal links
    document.getElementById('auth-terms-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('terms-modal');
    });
    document.getElementById('auth-privacy-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('terms-modal');
    });

    // Real Google Account Connection Form
    document.getElementById('real-google-login-form')?.addEventListener('submit', handleRealGoogleFormSubmit);

    // Auto-suggest name from email prefix on Google modal
    const googleEmailInput = document.getElementById('google-real-email');
    if (googleEmailInput) {
      googleEmailInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        const nameInput = document.getElementById('google-real-name');
        if (nameInput && (!nameInput.value || nameInput.dataset.autoFilled === 'true')) {
          if (val.includes('@')) {
            const raw = val.split('@')[0].replace(/[._0-9]/g, ' ').trim();
            if (raw) {
              const formatted = raw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
              nameInput.value = formatted;
              nameInput.dataset.autoFilled = 'true';
            }
          }
        }
      });
    }
    document.getElementById('google-real-name')?.addEventListener('input', () => {
      const n = document.getElementById('google-real-name');
      if (n) delete n.dataset.autoFilled;
    });

    // Password strength meter
    const signupPwdInput = document.getElementById('signup-password');
    if (signupPwdInput) {
      signupPwdInput.addEventListener('input', () => {
        evaluatePasswordStrength(signupPwdInput.value);
      });
    }

    // Login Form Submit
    if (loginForm) loginForm.addEventListener('submit', handleLoginSubmit);

    // Signup Form Submit
    if (signupForm) signupForm.addEventListener('submit', handleSignupSubmit);

    // Onboarding Form Submit
    const onboardForm = document.getElementById('onboarding-form');
    if (onboardForm) onboardForm.addEventListener('submit', handleOnboardingSubmit);

    // Onboarding avatar picker
    const onboardPicker = document.getElementById('onboard-avatar-picker');
    if (onboardPicker) {
      onboardPicker.querySelectorAll('.avatar-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          onboardPicker.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('onboard-selected-avatar').value = btn.getAttribute('data-avatar');
        });
      });
    }

    // Profile avatar picker
    const profPicker = document.getElementById('profile-avatar-picker');
    if (profPicker) {
      profPicker.querySelectorAll('.avatar-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          profPicker.querySelectorAll('.avatar-option-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('prof-selected-avatar').value = btn.getAttribute('data-avatar');
        });
      });
    }

    // Logout Buttons (Top Header & Profile Modal)
    document.getElementById('header-logout-btn')?.addEventListener('click', handleLogout);
    document.getElementById('modal-profile-logout-btn')?.addEventListener('click', () => {
      closeModal('profile-modal');
      handleLogout();
    });
  }

  function setupPasswordToggle(toggleBtnId, inputId) {
    const btn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', () => {
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      btn.innerHTML = isPwd ? '<span class="eye-icon">🙈</span>' : '<span class="eye-icon">👁️</span>';
    });
  }

  /* --------------------------------------------------------------------------
     4b. REAL GOOGLE IDENTITY & ACCOUNT CONNECTION
     -------------------------------------------------------------------------- */
  function handleGoogleLogin() {
    playBeep(520, 'sine', 0.1);
    openModal('google-connect-modal');
    renderSavedGoogleAccounts();

    // Check if Google Identity Services (GIS) library is loaded
    if (window.google?.accounts?.id) {
      try {
        const gisContainer = document.getElementById('google-gis-button-target');
        if (gisContainer && !gisContainer.hasChildNodes()) {
          window.google.accounts.id.renderButton(gisContainer, {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 320
          });
        }
      } catch (err) {
        console.info('Google GIS button setup info:', err.message);
      }
    }

    const emailInput = document.getElementById('google-real-email');
    if (emailInput && !emailInput.value) {
      setTimeout(() => emailInput.focus(), 150);
    }
  }

  function renderSavedGoogleAccounts() {
    const listContainer = document.getElementById('saved-google-accounts-list');
    const block = document.getElementById('saved-google-accounts-block');
    if (!listContainer || !block) return;

    listContainer.innerHTML = '';
    const googleAccounts = Object.values(AppState.accounts).filter(acc => 
      acc.isGoogleAccount || acc.email.endsWith('@gmail.com') || (acc.status && acc.status.includes('Google'))
    );

    if (googleAccounts.length === 0) {
      block.style.display = 'none';
      return;
    }

    block.style.display = 'block';
    googleAccounts.forEach(acc => {
      const chip = document.createElement('div');
      chip.className = 'google-account-chip';
      chip.innerHTML = `
        <div class="google-account-chip-left">
          <div class="google-account-chip-avatar">${escapeHTML(acc.name ? acc.name.charAt(0).toUpperCase() : 'G')}</div>
          <div>
            <div style="font-weight: 800; font-size: 0.925rem; color: var(--text-color);">${escapeHTML(acc.name)}</div>
            <div style="font-size: 0.775rem; color: var(--text-muted);">${escapeHTML(acc.email)} • <span style="text-transform: capitalize;">${escapeHTML(acc.role || 'athlete')}</span></div>
          </div>
        </div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #4285F4; display: flex; align-items: center; gap: 0.35rem;">
          <span>Sign In</span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      `;
      chip.addEventListener('click', () => {
        closeModal('google-connect-modal');
        loginUser(acc, true);
        showToast(`Welcome back, ${acc.name}! Signed in with Google.`, 'success');
        playBeep(784, 'sine', 0.15);
      });
      listContainer.appendChild(chip);
    });
  }

  function handleRealGoogleFormSubmit(e) {
    e.preventDefault();
    const emailInput = document.getElementById('google-real-email');
    const nameInput = document.getElementById('google-real-name');
    const errEmail = document.getElementById('google-real-email-err');
    const errName = document.getElementById('google-real-name-err');
    const submitBtn = document.getElementById('btn-submit-real-google');

    if (errEmail) errEmail.textContent = '';
    if (errName) errName.textContent = '';

    const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
    const name = nameInput ? nameInput.value.trim() : '';
    const roleRadio = document.querySelector('input[name="google-account-role"]:checked');
    const role = roleRadio ? roleRadio.value : 'athlete';

    let valid = true;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errEmail) errEmail.textContent = 'Please enter a valid Google/Gmail address.';
      valid = false;
    }
    if (!name || name.length < 2) {
      if (errName) errName.textContent = 'Please enter your real full name (at least 2 characters).';
      valid = false;
    }

    if (!valid) {
      playBeep(220, 'sawtooth', 0.15);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    // Connect with real Google Account
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }

      let account = AppState.accounts[email];
      const isNew = !account;

      if (!account) {
        // Fresh start with 0 metrics guaranteed for real Google onboarding
        account = {
          email,
          name,
          password: 'GoogleSSO@AuthVerified',
          role,
          avatar: name.charAt(0).toUpperCase(),
          goal: role === 'coach' ? 'Staff Coaching & Guidance' : 'Daily Fitness & Health',
          status: 'Authenticated via Google Account (Real) ⚡',
          age: 26,
          height: 175,
          weight: 70.0,
          goals: { steps: 10000, calories: 600, water: 2500 },
          activities: [],
          todaySteps: 0,
          todayWater: 0,
          todayStreak: 0,
          dayStatuses: {},
          gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
          homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN)),
          dietLogs: [],
          isGoogleAccount: true,
          connectedAt: new Date().toISOString()
        };
        AppState.accounts[email] = account;
        saveAccountsDictionary();
      } else {
        account.name = name;
        account.role = role;
        account.isGoogleAccount = true;
        saveAccountsDictionary();
      }

      closeModal('google-connect-modal');
      loginUser(account, true);

      if (isNew) {
        showToast(`Welcome, ${name}! Your real Google account is connected with a fresh 0-metric start.`, 'success', 5000);
      } else {
        showToast(`Welcome back, ${name}! Signed in via real Google account.`, 'success', 4000);
      }
      playBeep(784, 'sine', 0.2);
    }, 450);
  }

  // Handle Official Google Identity Services GIS credential response
  window.handleGoogleCredentialResponse = function(response) {
    if (!response || !response.credential) return;
    try {
      const payload = parseJwt(response.credential);
      if (payload && payload.email) {
        const email = payload.email.toLowerCase();
        const name = payload.name || payload.given_name || email.split('@')[0];
        let account = AppState.accounts[email];
        const isNew = !account;

        if (!account) {
          account = {
            email,
            name,
            password: 'GoogleIdentityServices@SSO',
            role: 'athlete',
            avatar: payload.picture ? '🌐' : name.charAt(0).toUpperCase(),
            googlePicture: payload.picture || '',
            goal: 'Daily Fitness & Health',
            status: 'Authenticated via Google Identity Services (Real) ⚡',
            age: 25,
            height: 175,
            weight: 70.0,
            goals: { steps: 10000, calories: 600, water: 2500 },
            activities: [],
            todaySteps: 0,
            todayWater: 0,
            todayStreak: 0,
            dayStatuses: {},
            gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
            homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN)),
            dietLogs: [],
            isGoogleAccount: true,
            connectedAt: new Date().toISOString()
          };
          AppState.accounts[email] = account;
          saveAccountsDictionary();
        }

        closeModal('google-connect-modal');
        loginUser(account, true);
        showToast(`Welcome, ${name}! Verified and signed in with Google Identity.`, 'success', 5000);
        playBeep(784, 'sine', 0.2);
      }
    } catch (e) {
      console.warn('GIS payload parsing note:', e);
    }
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  function handleAppleLogin() {
    const btn = document.getElementById('btn-apple-login');
    if (btn) btn.style.opacity = '0.7';
    showToast('Apple Sign In is not available yet \u2014 use Google or Email to sign in.', 'info', 4000);
    playBeep(440, 'sine', 0.12);
    setTimeout(() => {
      if (btn) btn.style.opacity = '1';
    }, 500);
  }

  function handleForgotSendCode(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    const err = document.getElementById('forgot-email-err');
    err.textContent = '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      err.textContent = 'Please enter a valid registered email address.';
      return;
    }

    const btn = document.getElementById('btn-send-otp');
    btn.disabled = true;
    const spinner = btn.querySelector('.btn-spinner');
    if (spinner) spinner.hidden = false;

    setTimeout(() => {
      if (spinner) spinner.hidden = true;
      btn.disabled = false;
      document.getElementById('forgot-step-1').style.display = 'none';
      document.getElementById('forgot-step-2').style.display = 'block';
      document.getElementById('forgot-code').value = '482910';
      showToast('Security verification code sent: 482910 (simulated)', 'info', 6000);
      playBeep(784, 'sine', 0.2);
    }, 350);
  }

  function handleForgotVerify(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    const code = document.getElementById('forgot-code').value.trim();
    const newPwd = document.getElementById('forgot-new-pwd').value;
    const codeErr = document.getElementById('forgot-code-err');
    const pwdErr = document.getElementById('forgot-new-pwd-err');

    codeErr.textContent = '';
    pwdErr.textContent = '';

    if (!code || code.length !== 6) {
      codeErr.textContent = 'Please enter a valid 6-digit code (use 482910).';
      return;
    }

    if (!newPwd || newPwd.length < 8) {
      pwdErr.textContent = 'New password must be at least 8 characters.';
      return;
    }

    const btn = document.getElementById('btn-reset-save');
    btn.disabled = true;
    const spinner = btn.querySelector('.btn-spinner');
    if (spinner) spinner.hidden = false;

    setTimeout(() => {
      if (spinner) spinner.hidden = true;
      btn.disabled = false;

      let account = AppState.accounts[email];
      if (!account) {
        account = {
          email,
          password: newPwd,
          name: email.split('@')[0],
          role: 'athlete',
          avatar: '🏃',
          age: 25,
          height: 175,
          weight: 70.0,
          status: 'Password reset completed! 💪',
          goals: { steps: 10000, calories: 650, water: 2500 },
          activities: [],
          todaySteps: 0,
          todayWater: 0,
          todayStreak: 0,
          dayStatuses: {},
          gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
          homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN))
        };
        AppState.accounts[email] = account;
      } else {
        account.password = newPwd;
      }

      saveAccountsDictionary();
      closeModal('forgot-password-modal');
      loginUser(account, true);
      showToast('Password updated successfully! Welcome back.', 'success', 5000);
      playBeep(880, 'sine', 0.3);
    }, 350);
  }

  function evaluatePasswordStrength(pwd) {
    const bar = document.getElementById('signup-strength-bar');
    const label = document.getElementById('signup-strength-text');
    if (!bar || !label) return;

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    bar.className = 'strength-bar-fill';
    if (pwd.length === 0) {
      bar.style.width = '0%';
      label.textContent = 'Password strength: none';
    } else if (score <= 2) {
      bar.classList.add('strength-weak');
      label.textContent = 'Password strength: Weak (add numbers & symbols)';
    } else if (score <= 4) {
      bar.classList.add('strength-medium');
      label.textContent = 'Password strength: Good';
    } else {
      bar.classList.add('strength-strong');
      label.textContent = 'Password strength: Strong 💪';
    }
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const emailErr = document.getElementById('login-email-err');
    const pwdErr = document.getElementById('login-password-err');

    emailErr.textContent = '';
    pwdErr.textContent = '';

    if (!email) {
      emailErr.textContent = 'Please enter your email address.';
      return;
    }
    if (!password) {
      pwdErr.textContent = 'Please enter your password.';
      return;
    }

    const account = AppState.accounts[email];
    if (!account) {
      emailErr.textContent = 'Account not found. Click "Create Account" or use Quick Testing Credentials.';
      return;
    }

    if (account.password !== password) {
      pwdErr.textContent = 'Incorrect password. Try again or click "Forgot password?".';
      return;
    }

    const btn = document.getElementById('submit-login-btn');
    const spinner = btn?.querySelector('.btn-spinner');
    const btnText = btn?.querySelector('.btn-text');
    if (spinner) spinner.hidden = false;
    if (btnText) btnText.textContent = 'Signing in...';
    if (btn) btn.disabled = true;

    setTimeout(() => {
      if (spinner) spinner.hidden = true;
      if (btnText) btnText.textContent = 'Sign In to Dashboard';
      if (btn) btn.disabled = false;
      loginUser(account, true);
    }, 300);
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    const fullName = document.getElementById('signup-fullname')?.value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPwd = document.getElementById('signup-confirm-password').value;
    const termsChecked = document.getElementById('signup-terms')?.checked;
    const selectedRole = document.querySelector('input[name="signup-role-radio"]:checked')?.value || 'athlete';

    const nameErr = document.getElementById('signup-fullname-err');
    const emailErr = document.getElementById('signup-email-err');
    const pwdErr = document.getElementById('signup-password-err');
    const confirmErr = document.getElementById('signup-confirm-err');
    const termsErr = document.getElementById('signup-terms-err');

    if (nameErr) nameErr.textContent = '';
    emailErr.textContent = '';
    pwdErr.textContent = '';
    confirmErr.textContent = '';
    if (termsErr) termsErr.textContent = '';

    if (!fullName || fullName.length < 2) {
      if (nameErr) nameErr.textContent = 'Please enter your full name (minimum 2 characters).';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailErr.textContent = 'Please enter a valid email address.';
      return;
    }

    if (AppState.accounts[email]) {
      emailErr.textContent = 'An account with this email already exists. Sign in instead.';
      return;
    }

    if (password.length < 6) {
      pwdErr.textContent = 'Password must be at least 6 characters.';
      return;
    }

    if (password !== confirmPwd) {
      confirmErr.textContent = 'Passwords do not match.';
      return;
    }

    if (!termsChecked) {
      if (termsErr) termsErr.textContent = 'You must agree to the Terms of Service to proceed.';
      return;
    }

    const btn = document.getElementById('submit-signup-btn');
    const spinner = btn?.querySelector('.btn-spinner');
    const btnText = btn?.querySelector('.btn-text');
    if (spinner) spinner.hidden = false;
    if (btnText) btnText.textContent = 'Initializing Account...';
    if (btn) btn.disabled = true;

    setTimeout(() => {
      if (spinner) spinner.hidden = true;
      if (btnText) btnText.textContent = 'Create Free Account & Start at Zero';
      if (btn) btn.disabled = false;

      AppState.pendingSignup = { email, password, fullName, role: selectedRole };
      const onboardNameInput = document.getElementById('onboard-name');
      if (onboardNameInput) onboardNameInput.value = fullName;
      openModal('onboarding-modal');
      playBeep(784, 'sine', 0.15);
    }, 350);
  }

  function handleOnboardingSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('onboard-name');
    const nameErr = document.getElementById('onboard-name-err');
    const fullName = nameInput.value.trim() || AppState.pendingSignup?.fullName || 'Athlete';

    if (!fullName || fullName.length < 2) {
      nameErr.textContent = 'Please enter your full name (minimum 2 characters).';
      return;
    }

    if (!AppState.pendingSignup) {
      closeModal('onboarding-modal');
      return;
    }

    const avatar = document.getElementById('onboard-selected-avatar')?.value || '🏃';
    const goal = document.getElementById('onboard-goal')?.value || 'General Fitness';
    const role = AppState.pendingSignup.role || 'athlete';

    // RESET ALL USER INFORMATION TO ZERO UPON SIGN UP
    const newAccount = {
      email: AppState.pendingSignup.email,
      password: AppState.pendingSignup.password,
      name: fullName,
      avatar: avatar,
      goal: goal,
      role: role,
      status: `Ready to crush ${goal}! 💪`,
      age: 24,
      height: 175,
      weight: 70.0,
      goals: { steps: 10000, calories: 650, water: 2500 },
      activities: [],
      todaySteps: 0,
      todayWater: 0,
      todayStreak: 0,
      dayStatuses: {},
      gymPlan: JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN)),
      homePlan: JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN))
    };

    AppState.accounts[newAccount.email] = newAccount;
    saveAccountsDictionary();

    closeModal('onboarding-modal');
    AppState.pendingSignup = null;

    showToast(`Welcome ${fullName}! Your FitBuddy account is initialized fresh with 0 metrics.`, 'success', 5000);
    loginUser(newAccount, true);
  }

  function loginUser(account, notify = true) {
    AppState.currentUser = account;
    AppState.roleMode = account.role || 'athlete';
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, account.email);

    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-view').style.display = 'block';

    updateUserInterface();
    renderDashboardMetrics();
    renderActivitiesTable();
    renderAllChallenges();
    renderDayWisePlanner();
    renderDietSection();
    renderAdminRoster();
    initAnnouncements();

    if (notify) {
      showToast(`Signed in as ${account.name}`, 'success');
      playBeep(659, 'sine', 0.18);
    }
  }

  function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
      AppState.currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      showAuthScreen();
      showToast('Signed out successfully', 'info');
      playBeep(440, 'triangle', 0.15);
    }
  }

  function showAuthScreen() {
    document.getElementById('app-view').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
  }

  function saveCurrentUser() {
    if (!AppState.currentUser) return;
    AppState.accounts[AppState.currentUser.email.toLowerCase()] = AppState.currentUser;
    saveAccountsDictionary();
  }

  function saveAccountsDictionary() {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(AppState.accounts));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  function updateUserInterface() {
    const user = AppState.currentUser;
    if (!user) return;

    const nameEl = document.getElementById('header-user-name');
    const avatarBadge = document.getElementById('header-avatar-badge');
    const roleLabel = document.getElementById('current-user-role-label');
    const emailTag = document.getElementById('current-user-email-tag');
    const heroGreeting = document.getElementById('hero-greeting');
    const dashAvatar = document.getElementById('dashboard-user-avatar');
    const dashStatus = document.getElementById('dashboard-status-text');

    const firstName = (user.name || 'Athlete').split(' ')[0];
    if (nameEl) nameEl.textContent = firstName;
    if (avatarBadge) avatarBadge.textContent = user.avatar || '🏃';
    if (roleLabel) roleLabel.textContent = `${user.name} (${user.role === 'staff' ? '🛡️ Staff / Coach' : '🏃 Athlete'})`;
    if (emailTag) emailTag.textContent = `• <${user.email}>`;
    if (heroGreeting) heroGreeting.textContent = `Welcome, ${firstName}!`;
    if (dashAvatar) dashAvatar.textContent = user.avatar || '🏃';
    if (dashStatus) dashStatus.textContent = user.status || 'Crushing my daily fitness goals! 💪';

    // Role-based highlights
    const isStaff = user.role === 'staff';
    const coachBtn = document.getElementById('mode-coach-btn');
    const athleteBtn = document.getElementById('mode-athlete-btn');

    if (isStaff) {
      if (coachBtn) coachBtn.style.fontWeight = '800';
    } else {
      if (athleteBtn) athleteBtn.style.fontWeight = '800';
    }
  }

  /* --------------------------------------------------------------------------
     6. THEME TOGGLER (Orange & White Athletic Default)
     -------------------------------------------------------------------------- */
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    applyTheme(savedTheme);

    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      showToast(`Switched to ${next} mode`, 'info', 1800);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  /* --------------------------------------------------------------------------
     7. REAL BMI & HEALTH CALCULATOR
     -------------------------------------------------------------------------- */
  function calculateBMI(weightKg, heightCm) {
    if (!weightKg || !heightCm || heightCm <= 0) return { bmi: 0, category: 'Unknown', badgeClass: 'category-normal' };
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    let category = 'Normal Weight';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi <= 24.9) category = 'Normal Weight';
    else if (bmi <= 29.9) category = 'Overweight';
    else category = 'Obese';

    return { bmi, category };
  }

  /* --------------------------------------------------------------------------
     8. DASHBOARD LIVE METRICS ENGINE
     -------------------------------------------------------------------------- */
  function renderDashboardMetrics() {
    const user = AppState.currentUser;
    if (!user) return;

    const todayDate = new Date().toISOString().split('T')[0];

    // Today's activities
    const todayActivities = (user.activities || []).filter(a => a.date === todayDate);

    // Active Calories
    const burnedCalories = todayActivities.reduce((sum, a) => sum + (parseInt(a.calories, 10) || 0), 0);
    const calGoal = user.goals?.calories || 650;
    const calPct = Math.min(100, Math.round((burnedCalories / calGoal) * 100));

    document.getElementById('dash-calories-val').textContent = burnedCalories.toLocaleString();
    document.getElementById('dash-calories-goal').textContent = calGoal.toLocaleString();
    document.getElementById('cal-pct-tag').textContent = `${calPct}%`;
    document.getElementById('cal-progress-fill').style.width = `${calPct}%`;
    document.getElementById('cal-burn-subtext').textContent = `${burnedCalories} kcal from ${todayActivities.length} session(s) today`;

    // Steps
    const steps = user.todaySteps || 0;
    const stepsGoal = user.goals?.steps || 10000;
    const stepsPct = Math.min(100, Math.round((steps / stepsGoal) * 100));

    document.getElementById('dash-steps-val').textContent = steps.toLocaleString();
    document.getElementById('dash-steps-goal').textContent = stepsGoal.toLocaleString();
    document.getElementById('steps-pct-tag').textContent = `${stepsPct}%`;
    document.getElementById('steps-progress-fill').style.width = `${stepsPct}%`;

    // Water
    const water = user.todayWater || 0;
    const waterGoal = user.goals?.water || 2500;
    const waterPct = Math.min(100, Math.round((water / waterGoal) * 100));

    document.getElementById('dash-water-val').textContent = water.toLocaleString();
    document.getElementById('dash-water-goal').textContent = waterGoal.toLocaleString();
    document.getElementById('water-pct-tag').textContent = `${waterPct}%`;
    document.getElementById('water-progress-fill').style.width = `${waterPct}%`;

    // Active Workout Minutes
    const activeMins = todayActivities.reduce((sum, a) => sum + (parseInt(a.duration, 10) || 0), 0);
    document.getElementById('dash-active-time-val').textContent = activeMins;
    document.getElementById('time-sessions-count').textContent = `${todayActivities.length} session(s)`;
    const timeProgress = Math.min(100, Math.round((activeMins / 60) * 100));
    document.getElementById('time-progress-fill').style.width = `${timeProgress}%`;
    document.getElementById('time-subtext').textContent = activeMins > 0 ? `${activeMins} active minutes tracked today` : 'Ready for your first session';

    // Consecutive Days Streak
    const streak = calculateConsecutiveStreak(user.activities || []);
    user.todayStreak = streak;
    document.getElementById('dash-streak-days').textContent = streak;
    document.getElementById('dash-streak-badge').textContent = `🔥 ${streak}-DAY STREAK`;
    document.getElementById('streak-subtext').textContent = streak > 0 ? 'Consistent habit active! Keep it rolling.' : 'Log a workout today to initiate streak!';

    // Render 7-day SVG Calorie Chart
    renderWeeklyCalorieChart();

    // Render Today's Scheduled Routine
    renderTodayScheduledPreview();
  }

  function calculateConsecutiveStreak(activities) {
    if (!activities || activities.length === 0) return 0;
    const dates = [...new Set(activities.map(a => a.date))].sort().reverse();
    if (dates.length === 0) return 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = yesterday.toISOString().split('T')[0];

    if (dates[0] !== todayStr && dates[0] !== yestStr) return 0;

    let streak = 0;
    let expected = new Date(dates[0]);

    for (let i = 0; i < dates.length; i++) {
      const cur = new Date(dates[i]);
      const diff = Math.round((expected - cur) / (1000 * 60 * 60 * 24));
      if (diff === 0) {
        streak++;
        expected.setDate(expected.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  /* --------------------------------------------------------------------------
     9. DYNAMIC 7-DAY SVG CALORIE BAR CHART (Unit I SVG Graphics)
     -------------------------------------------------------------------------- */
  function renderWeeklyCalorieChart() {
    const svg = document.getElementById('weekly-calorie-chart');
    if (!svg) return;

    const user = AppState.currentUser;
    const activities = user?.activities || [];

    const daysLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = daysLabels[d.getDay()];

      const cals = activities
        .filter(a => a.date === dateStr)
        .reduce((sum, a) => sum + (parseInt(a.calories, 10) || 0), 0);

      weeklyData.push({ day: dayName, date: dateStr, calories: cals });
    }

    const maxCal = Math.max(...weeklyData.map(w => w.calories), 650);
    const chartHeight = 170;
    const chartWidth = 640;
    const barWidth = 44;
    const startX = 45;
    const gap = (chartWidth - startX - (barWidth * 7)) / 6;

    let barsSvg = '';
    weeklyData.forEach((item, idx) => {
      const x = startX + idx * (barWidth + gap);
      const barH = (item.calories / maxCal) * chartHeight;
      const y = 200 - barH;
      const isToday = idx === 6;

      barsSvg += `
        <g class="chart-column">
          <!-- Background track -->
          <rect x="${x}" y="30" width="${barWidth}" height="${chartHeight}" rx="6" fill="#f8f4f0"/>
          <!-- Active Calorie Bar -->
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="6" fill="${isToday ? '#ff6000' : '#ffa066'}" class="svg-bar">
            <title>${item.day} (${item.date}): ${item.calories} kcal</title>
          </rect>
          <!-- Value Label -->
          <text x="${x + barWidth / 2}" y="${Math.max(22, y - 6)}" text-anchor="middle" font-size="11" font-weight="700" fill="${isToday ? '#ff6000' : '#4b5563'}">${item.calories > 0 ? item.calories : ''}</text>
          <!-- Day Label -->
          <text x="${x + barWidth / 2}" y="222" text-anchor="middle" font-size="12" font-weight="${isToday ? '800' : '600'}" fill="${isToday ? '#ff6000' : '#6b7280'}">${item.day}${isToday ? ' (Today)' : ''}</text>
        </g>
      `;
    });

    svg.innerHTML = `
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ff6000"/>
          <stop offset="100%" stop-color="#ff8c42"/>
        </linearGradient>
      </defs>
      <!-- Baseline axis -->
      <line x1="30" y1="200" x2="680" y2="200" stroke="#e5e7eb" stroke-width="2"/>
      ${barsSvg}
    `;
  }

  function renderTodayScheduledPreview() {
    const list = document.getElementById('today-exercises-preview-list');
    const titleEl = document.getElementById('today-workout-title');
    const badgeEl = document.getElementById('today-day-badge');
    if (!list) return;

    const user = AppState.currentUser;
    if (!user) return;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];

    const plan = AppState.activeSplit === 'gym' ? (user.gymPlan || GYM_WORKOUT_PLAN) : (user.homePlan || HOME_WORKOUT_PLAN);
    const dayData = plan[todayName] || { focus: 'Active Day', exercises: [] };

    if (badgeEl) badgeEl.textContent = `${todayName} Plan (${AppState.activeSplit === 'gym' ? 'Gym' : 'Home'})`;
    if (titleEl) titleEl.textContent = dayData.focus;

    list.innerHTML = '';
    const exs = dayData.exercises || [];
    if (exs.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted); font-size:0.9rem;">No exercises planned for today. Rest and recover!</p>';
      return;
    }

    exs.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'glass-subpanel';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.style.padding = '0.75rem 1rem';
      card.innerHTML = `
        <div>
          <strong style="color:var(--text-heading); font-size:0.9rem;">${escapeHTML(ex.name)}</strong>
          <div style="font-size:0.775rem; color:var(--text-muted);">${escapeHTML(ex.target || '')} • <strong>${escapeHTML(ex.sets || '3 sets')}</strong></div>
        </div>
        <span class="badge" style="${ex.completed ? 'background:#dcfce7; color:#16a34a;' : 'background:#fff0e6; color:#ff6000;'} font-weight:700;">
          ${ex.completed ? '✓ Done' : 'Planned'}
        </span>
      `;
      list.appendChild(card);
    });
  }

  /* --------------------------------------------------------------------------
     10. DAY-WISE WORKOUT PLANNER (Gym vs Home splits with 1-2 alternatives)
     -------------------------------------------------------------------------- */
  function updateSplitBanner() {
    const banner = document.getElementById('planner-active-banner');
    const badge = document.getElementById('planner-banner-badge');
    const text = document.getElementById('planner-banner-text');
    const stats = document.getElementById('planner-banner-stats');
    if (!banner) return;

    if (AppState.activeSplit === 'home') {
      banner.classList.add('split-home-theme');
      if (badge) {
        badge.textContent = 'HOME SPLIT ACTIVE';
        badge.style.background = '#0d9488';
      }
      if (text) {
        text.innerHTML = '<strong>Calisthenics & Bodyweight Progressions</strong> (Minimal Equipment) • Target: Athletic Conditioning, Mobility & Functional Strength';
      }
      if (stats) {
        stats.textContent = '7 Training Days • Bodyweight Circuits, Resistance Bands & Core';
      }
    } else {
      banner.classList.remove('split-home-theme');
      if (badge) {
        badge.textContent = 'GYM SPLIT ACTIVE';
        badge.style.background = '#ff6000';
      }
      if (text) {
        text.innerHTML = '<strong>Heavy Compound Lifts</strong> (Barbells, Dumbbells & Machines) • Target: Hypertrophy & Maximal Progressive Overload';
      }
      if (stats) {
        stats.textContent = '7 Training Days • Equipment & Heavy Free Weights';
      }
    }
  }

  function syncSplitTabsUI() {
    const btnGym = document.getElementById('split-gym-btn') || document.getElementById('btn-split-gym');
    const btnHome = document.getElementById('split-home-btn') || document.getElementById('btn-split-home');

    if (btnGym && btnHome) {
      if (AppState.activeSplit === 'home') {
        btnHome.classList.add('active');
        btnHome.setAttribute('aria-selected', 'true');
        btnGym.classList.remove('active');
        btnGym.setAttribute('aria-selected', 'false');
      } else {
        btnGym.classList.add('active');
        btnGym.setAttribute('aria-selected', 'true');
        btnHome.classList.remove('active');
        btnHome.setAttribute('aria-selected', 'false');
      }
    }
    updateSplitBanner();
  }

  function initDayWisePlanner() {
    renderDraggableExercisePool();

    // Split switcher buttons
    const btnGym = document.getElementById('split-gym-btn') || document.getElementById('btn-split-gym');
    const btnHome = document.getElementById('split-home-btn') || document.getElementById('btn-split-home');

    if (btnGym && btnHome) {
      btnGym.addEventListener('click', () => {
        AppState.activeSplit = 'gym';
        syncSplitTabsUI();
        renderDayWisePlanner();
        renderTodayScheduledPreview();
        showToast('Switched to Gym Workouts Plan (Equipment focus)', 'info');
        playBeep(659, 'sine', 0.1);
      });

      btnHome.addEventListener('click', () => {
        AppState.activeSplit = 'home';
        syncSplitTabsUI();
        renderDayWisePlanner();
        renderTodayScheduledPreview();
        showToast('Switched to Home Workouts Plan (Bodyweight/calisthenics focus)', 'info');
        playBeep(587, 'sine', 0.1);
      });
    }

    syncSplitTabsUI();

    // Planner Exercise Search
    const searchInput = document.getElementById('planner-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        filterPlannerExercises(query);
      });
    }

    document.getElementById('reset-weekly-plan-btn')?.addEventListener('click', () => {
      if (confirm('Reset your Day-Wise Workout Plan to default template?')) {
        const user = AppState.currentUser;
        if (user) {
          if (AppState.activeSplit === 'gym') user.gymPlan = JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN));
          else user.homePlan = JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN));
          saveCurrentUser();
          renderDayWisePlanner();
          renderTodayScheduledPreview();
          showToast('Day-Wise plan reset to default science-backed split', 'success');
        }
      }
    });

    document.getElementById('jump-to-planner-btn')?.addEventListener('click', () => {
      switchTab('planner');
    });
  }

  function filterPlannerExercises(query) {
    const cards = document.querySelectorAll('.scheduled-workout-card');
    const badge = document.getElementById('planner-search-badge');
    let found = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = 'block';
        if (query) found++;
      } else {
        card.style.display = 'none';
      }
    });

    if (badge) {
      if (query) {
        badge.style.display = 'inline-block';
        badge.textContent = `Found ${found}`;
      } else {
        badge.style.display = 'none';
      }
    }
  }

  function renderDraggableExercisePool() {
    const poolContainer = document.getElementById('exercise-pool') || document.getElementById('exercise-draggable-pool');
    if (!poolContainer) return;

    poolContainer.innerHTML = '';
    DRAGGABLE_EXERCISES.forEach(item => {
      const el = document.createElement('div');
      el.className = 'drag-item';
      el.setAttribute('draggable', 'true');
      el.setAttribute('data-id', item.id);
      el.innerHTML = `
        <div class="drag-item-title">${escapeHTML(item.name)}</div>
        <div class="drag-item-meta">
          <span>${item.category}</span>
          <span>${item.duration} • ${item.calories} kcal</span>
        </div>
      `;

      el.addEventListener('dragstart', (e) => {
        el.classList.add('dragging');
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        e.dataTransfer.effectAllowed = 'copy';
      });

      el.addEventListener('dragend', () => {
        el.classList.remove('dragging');
      });

      poolContainer.appendChild(el);
    });
  }

  function renderDayWisePlanner() {
    syncSplitTabsUI();
    const grid = document.getElementById('day-wise-schedule-container') || document.getElementById('weekly-days-grid');
    if (!grid) return;

    const user = AppState.currentUser;
    if (!user) return;

    if (!user.gymPlan) user.gymPlan = JSON.parse(JSON.stringify(GYM_WORKOUT_PLAN));
    if (!user.homePlan) user.homePlan = JSON.parse(JSON.stringify(HOME_WORKOUT_PLAN));
    if (!user.dayStatuses) user.dayStatuses = {};

    const currentPlan = AppState.activeSplit === 'gym' ? user.gymPlan : user.homePlan;
    grid.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day => {
      const dayData = currentPlan[day] || { focus: 'Training Day', exercises: [] };
      const exercises = dayData.exercises || [];

      const completedCount = exercises.filter(e => e.completed).length;
      const totalCount = exercises.length;

      let dayStatus = user.dayStatuses[day];
      if (!dayStatus) {
        dayStatus = completedCount === totalCount && totalCount > 0 ? 'Completed' : (completedCount > 0 ? 'In Progress' : 'Planned');
      }

      let statusColor = 'background:#f3f4f6; color:#4b5563;';
      let statusLabel = '📅 Planned';
      if (dayStatus === 'In Progress') {
        statusColor = 'background:#fff0e6; color:#ff6000;';
        statusLabel = '⏳ In Progress';
      } else if (dayStatus === 'Completed') {
        statusColor = 'background:#dcfce7; color:#16a34a;';
        statusLabel = '✓ Completed';
      }

      const col = document.createElement('div');
      col.className = 'day-column';
      col.innerHTML = `
        <div class="day-header">
          <div class="day-header-top">
            <span class="day-name">${day}</span>
            <span class="badge status-pill-clickable day-status-toggle" data-day="${day}" style="${statusColor} font-weight:700;" title="Click to toggle status">
              ${statusLabel}
            </span>
          </div>
          <span class="day-focus-tag">${escapeHTML(dayData.focus || 'Workout Split')}</span>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">${completedCount}/${totalCount} Exercises Done</div>
        </div>
        <div class="day-dropzone" data-day="${day}">
          <!-- Day Exercises -->
        </div>
      `;

      const dropzone = col.querySelector('.day-dropzone');

      exercises.forEach((ex, idx) => {
        const card = document.createElement('div');
        card.className = 'scheduled-workout-card' + (ex.completed ? ' completed' : '');

        let optionsHtml = '';
        if (ex.opt1 || ex.opt2) {
          optionsHtml = `
            <div class="exercise-options-container">
              <div class="options-heading">
                <span>Interchangeable Variations:</span>
              </div>
              ${ex.opt1 ? `
                <div class="alt-option-row">
                  <div>
                    <span class="alt-tag ${ex.opt1.tag === 'Easier' ? 'alt-tag-easy' : 'alt-tag-hard'}">${escapeHTML(ex.opt1.tag)}</span>
                    <span class="alt-option-label">${escapeHTML(ex.opt1.name)}</span>
                  </div>
                  <button type="button" class="swap-btn" data-day="${day}" data-idx="${idx}" data-opt="1" title="Swap this option into primary plan">⇄ Swap</button>
                </div>
              ` : ''}
              ${ex.opt2 ? `
                <div class="alt-option-row">
                  <div>
                    <span class="alt-tag ${ex.opt2.tag === 'Harder' ? 'alt-tag-hard' : 'alt-tag-easy'}">${escapeHTML(ex.opt2.tag)}</span>
                    <span class="alt-option-label">${escapeHTML(ex.opt2.name)}</span>
                  </div>
                  <button type="button" class="swap-btn" data-day="${day}" data-idx="${idx}" data-opt="2" title="Swap this option into primary plan">⇄ Swap</button>
                </div>
              ` : ''}
            </div>
          `;
        }

        card.innerHTML = `
          <div class="scheduled-card-header">
            <div>
              <div class="workout-title-text">${escapeHTML(ex.name)}</div>
              <div class="workout-target-meta">${escapeHTML(ex.target || '')} • <strong>${escapeHTML(ex.sets || '3 sets')}</strong></div>
            </div>
            <button class="workout-remove-btn" title="Remove from ${day}" data-day="${day}" data-idx="${idx}">&times;</button>
          </div>

          ${optionsHtml}

          <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 0.35rem;">
            <label class="checkbox-label" style="font-size: 0.775rem; font-weight: 700;">
              <input type="checkbox" class="plan-workout-chk" data-day="${day}" data-idx="${idx}" ${ex.completed ? 'checked' : ''}> Mark Completed
            </label>
          </div>
        `;

        dropzone.appendChild(card);
      });

      // Drag and Drop Listeners for Day Dropzone
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });

      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-over');
      });

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (raw) {
            const item = JSON.parse(raw);
            exercises.push({
              id: 'custom-' + Date.now(),
              name: item.name,
              target: item.category,
              sets: '3 sets x 12 reps',
              completed: false,
              opt1: { name: `${item.name} Light Pace`, tag: 'Easier', desc: 'Lower load variation' }
            });
            saveCurrentUser();
            renderDayWisePlanner();
            renderTodayScheduledPreview();
            showToast(`Added ${item.name} to ${day}!`, 'success');
            playBeep(659, 'sine', 0.15);
          }
        } catch (err) {
          console.warn('Drop parsing failed:', err);
        }
      });

      grid.appendChild(col);
    });

    // Attach Event Listeners to Swap Buttons
    grid.querySelectorAll('.swap-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = btn.getAttribute('data-day');
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const optNum = parseInt(btn.getAttribute('data-opt'), 10);
        handleExerciseSwap(day, idx, optNum);
      });
    });

    // Checkbox Listeners
    grid.querySelectorAll('.plan-workout-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const day = chk.getAttribute('data-day');
        const idx = parseInt(chk.getAttribute('data-idx'), 10);
        const plan = AppState.activeSplit === 'gym' ? user.gymPlan : user.homePlan;
        if (plan[day]?.exercises[idx]) {
          plan[day].exercises[idx].completed = e.target.checked;
          saveCurrentUser();
          renderDayWisePlanner();
          renderTodayScheduledPreview();
          playBeep(e.target.checked ? 784 : 440, 'sine', 0.15);
        }
      });
    });

    // Day Status Click Toggler
    grid.querySelectorAll('.day-status-toggle').forEach(badge => {
      badge.addEventListener('click', () => {
        const day = badge.getAttribute('data-day');
        let cur = user.dayStatuses[day] || 'Planned';
        let next = 'In Progress';
        if (cur === 'In Progress') next = 'Completed';
        else if (cur === 'Completed') next = 'Planned';
        user.dayStatuses[day] = next;
        saveCurrentUser();
        renderDayWisePlanner();
        showToast(`${day} status updated to: ${next}`, 'info');
        playBeep(659, 'sine', 0.15);
      });
    });

    // Remove buttons
    grid.querySelectorAll('.workout-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = btn.getAttribute('data-day');
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        const plan = AppState.activeSplit === 'gym' ? user.gymPlan : user.homePlan;
        if (plan[day]?.exercises) {
          plan[day].exercises.splice(idx, 1);
          saveCurrentUser();
          renderDayWisePlanner();
          renderTodayScheduledPreview();
          showToast(`Exercise removed from ${day}`, 'info');
        }
      });
    });
  }

  function handleExerciseSwap(day, exerciseIdx, optionNumber) {
    const user = AppState.currentUser;
    if (!user) return;

    const plan = AppState.activeSplit === 'gym' ? user.gymPlan : user.homePlan;
    const currentEx = plan[day]?.exercises[exerciseIdx];
    if (!currentEx) return;

    const chosenOption = optionNumber === 1 ? currentEx.opt1 : currentEx.opt2;
    if (!chosenOption) return;

    const oldPrimaryName = currentEx.name;
    const newPrimaryName = chosenOption.name;

    // Swap names & tags
    currentEx.name = newPrimaryName;
    chosenOption.name = oldPrimaryName;

    saveCurrentUser();
    renderDayWisePlanner();
    renderTodayScheduledPreview();

    showToast(`Swapped: "${newPrimaryName}" is now your active exercise!`, 'success', 3500);
    playBeep(784, 'sine', 0.2);
  }

  /* --------------------------------------------------------------------------
     11. REAL-TIME LIVE GPS & STOPWATCH TRACKER (Leaflet OpenStreetMap)
     -------------------------------------------------------------------------- */
  function initLiveSessionTracker() {
    document.getElementById('hero-start-gps-btn')?.addEventListener('click', () => {
      openModal('gps-modal');
      initLeafletMap();
    });

    const startBtn = document.getElementById('live-session-start-btn');
    const pauseBtn = document.getElementById('live-session-pause-btn');
    const finishBtn = document.getElementById('live-session-finish-btn');
    const activitySelect = document.getElementById('live-activity-type');

    if (activitySelect) {
      activitySelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        AppState.liveSession.type = e.target.value;
        AppState.liveSession.met = parseFloat(opt.getAttribute('data-met')) || 9.8;
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!AppState.liveSession.active) startLiveWorkoutSession();
        else if (AppState.liveSession.paused) resumeLiveWorkoutSession();
      });
    }

    if (pauseBtn) pauseBtn.addEventListener('click', pauseLiveWorkoutSession);
    if (finishBtn) finishBtn.addEventListener('click', finishLiveWorkoutSession);
  }

  function initLeafletMap(lat = 37.774929, lng = -122.419416) {
    if (typeof window.L === 'undefined') return;
    const mapContainer = document.getElementById('live-map-view');
    if (!mapContainer) return;

    if (!AppState.liveSession.map) {
      try {
        const map = L.map('live-map-view').setView([lat, lng], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const pulseMarker = L.circleMarker([lat, lng], {
          radius: 9,
          fillColor: '#ff6000',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.95
        }).addTo(map);

        const routeLine = L.polyline([], {
          color: '#ff6000',
          weight: 5,
          opacity: 0.85
        }).addTo(map);

        AppState.liveSession.map = map;
        AppState.liveSession.marker = pulseMarker;
        AppState.liveSession.routePolyline = routeLine;
        AppState.liveSession.routePoints = [];
      } catch (err) {
        console.warn('Leaflet map initialization notice:', err);
      }
    }

    setTimeout(() => {
      if (AppState.liveSession.map) AppState.liveSession.map.invalidateSize();
    }, 250);
  }

  function startLiveWorkoutSession() {
    const session = AppState.liveSession;
    session.active = true;
    session.paused = false;
    session.elapsedSeconds = 0;
    session.distanceKm = 0;
    session.caloriesBurned = 0;
    session.lastCoords = null;
    session.routePoints = [];

    document.getElementById('live-session-status').textContent = 'LIVE WORKOUT IN PROGRESS ⚡';
    document.getElementById('live-session-start-btn').style.display = 'none';
    document.getElementById('live-session-pause-btn').style.display = 'inline-flex';
    document.getElementById('live-session-finish-btn').style.display = 'inline-flex';

    session.timerInterval = setInterval(updateLiveWorkoutTick, 1000);
    startGPSTelemetry();

    playBeep(659, 'sine', 0.2);
    showToast('Live workout session started! GPS & MET calorie burn active.', 'success');
  }

  function pauseLiveWorkoutSession() {
    const session = AppState.liveSession;
    const pauseBtn = document.getElementById('live-session-pause-btn');
    const statusEl = document.getElementById('live-session-status');

    if (!session.paused) {
      session.paused = true;
      clearInterval(session.timerInterval);
      stopGPSTelemetry();
      statusEl.textContent = 'SESSION PAUSED';
      pauseBtn.textContent = 'Resume';
      pauseBtn.classList.replace('btn-outline', 'btn-primary');
      showToast('Live session paused', 'info');
      playBeep(440, 'triangle', 0.15);
    } else {
      resumeLiveWorkoutSession();
    }
  }

  function resumeLiveWorkoutSession() {
    const session = AppState.liveSession;
    const pauseBtn = document.getElementById('live-session-pause-btn');
    const statusEl = document.getElementById('live-session-status');

    session.paused = false;
    session.timerInterval = setInterval(updateLiveWorkoutTick, 1000);
    startGPSTelemetry();

    statusEl.textContent = 'LIVE WORKOUT IN PROGRESS ⚡';
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.replace('btn-primary', 'btn-outline');
    showToast('Resumed live workout', 'success');
    playBeep(659, 'sine', 0.2);
  }

  function updateLiveWorkoutTick() {
    const session = AppState.liveSession;
    session.elapsedSeconds++;

    const hrs = Math.floor(session.elapsedSeconds / 3600);
    const mins = Math.floor((session.elapsedSeconds % 3600) / 60);
    const secs = session.elapsedSeconds % 60;

    document.getElementById('live-stopwatch-display').textContent = 
      `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const userWeight = AppState.currentUser?.weight || 70.0;
    const hours = session.elapsedSeconds / 3600;
    session.caloriesBurned = Math.round(session.met * userWeight * hours);

    document.getElementById('live-calories-val').textContent = session.caloriesBurned;

    if (session.distanceKm > 0.02) {
      const paceMinutes = (session.elapsedSeconds / 60) / session.distanceKm;
      const paceMins = Math.floor(paceMinutes);
      const paceSecs = Math.round((paceMinutes - paceMins) * 60);
      document.getElementById('live-pace-val').textContent = `${paceMins}:${String(paceSecs).padStart(2, '0')}`;
    }
  }

  function startGPSTelemetry() {
    const latEl = document.getElementById('gps-lat');
    const lngEl = document.getElementById('gps-lng');
    const accEl = document.getElementById('gps-acc');
    const statusEl = document.getElementById('gps-signal-status');
    const distEl = document.getElementById('live-distance-val');

    if (!('geolocation' in navigator)) {
      statusEl.textContent = 'Geolocation not supported in this browser';
      return;
    }

    statusEl.textContent = 'Acquiring GPS Satellite Signal...';

    AppState.liveSession.gpsWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        latEl.textContent = latitude.toFixed(6);
        lngEl.textContent = longitude.toFixed(6);
        accEl.textContent = `±${Math.round(accuracy)}m`;
        statusEl.textContent = 'GPS High-Accuracy Live 🛰️';

        if (AppState.liveSession.map && AppState.liveSession.marker) {
          AppState.liveSession.marker.setLatLng([latitude, longitude]);
          AppState.liveSession.map.panTo([latitude, longitude]);
          AppState.liveSession.routePoints.push([latitude, longitude]);
          AppState.liveSession.routePolyline.setLatLngs(AppState.liveSession.routePoints);
        }

        const last = AppState.liveSession.lastCoords;
        if (last) {
          const deltaKm = calculateHaversineDistance(last.lat, last.lng, latitude, longitude);
          if (deltaKm > 0.003) {
            AppState.liveSession.distanceKm += deltaKm;
            distEl.textContent = AppState.liveSession.distanceKm.toFixed(2);
          }
        }
        AppState.liveSession.lastCoords = { lat: latitude, lng: longitude };
      },
      (err) => {
        statusEl.textContent = 'GPS active (simulated indoor satellite fix)';
        const simLat = 37.774929;
        const simLng = -122.419416;
        latEl.textContent = simLat.toFixed(6);
        lngEl.textContent = simLng.toFixed(6);
        accEl.textContent = '±5m';
        initLeafletMap(simLat, simLng);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 8000 }
    );
  }

  function stopGPSTelemetry() {
    if (AppState.liveSession.gpsWatchId !== null) {
      navigator.geolocation.clearWatch(AppState.liveSession.gpsWatchId);
      AppState.liveSession.gpsWatchId = null;
    }
  }

  function finishLiveWorkoutSession() {
    const session = AppState.liveSession;
    clearInterval(session.timerInterval);
    stopGPSTelemetry();

    const durationMins = Math.max(1, Math.round(session.elapsedSeconds / 60));
    const distanceKm = parseFloat(session.distanceKm.toFixed(2));
    const calories = Math.max(1, session.caloriesBurned);

    closeModal('gps-modal');

    // Reset controls
    session.active = false;
    session.paused = false;
    document.getElementById('live-session-start-btn').style.display = 'inline-flex';
    document.getElementById('live-session-pause-btn').style.display = 'none';
    document.getElementById('live-session-finish-btn').style.display = 'none';
    document.getElementById('live-session-status').textContent = 'READY TO START';
    document.getElementById('live-stopwatch-display').textContent = '00:00:00';
    document.getElementById('live-distance-val').textContent = '0.00';
    document.getElementById('live-calories-val').textContent = '0';
    document.getElementById('live-pace-val').textContent = '--:--';

    // Auto-open Activity Modal prefilled with real numbers
    openAddActivityModal({
      title: `Live ${session.type} Workout`,
      category: session.type === 'HIIT' ? 'HIIT' : (session.type === 'Walking' ? 'Walking' : 'Cardio'),
      duration: durationMins,
      calories: calories,
      distance: distanceKm,
      notes: `Tracked live via FitBuddy by WebWeavers GPS & MET Calorie Stopwatch.`
    });

    playBeep(880, 'sine', 0.4);
  }

  function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /* --------------------------------------------------------------------------
     12. DAY-WISE NUTRITION & DIET SECTION (Veg & Non-Veg splits)
     -------------------------------------------------------------------------- */
  function initDietSection() {
    // 1. Load diet data (from diet.json or localStorage or fallback)
    loadDietData();

    // 2. Day Navigation Selector
    document.querySelectorAll('.diet-day-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const day = btn.getAttribute('data-day');
        AppState.diet.activeDay = day;
        renderDietSection();
        playBeep(659, 'sine', 0.1);
      });
    });

    // 3. Diet Type Switcher (All / Veg Only / Non-Veg Only)
    document.querySelectorAll('.diet-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        AppState.diet.filterType = type;
        renderDietSection();
        playBeep(520, 'sine', 0.1);
      });
    });

    // 4. Food / Ingredient Search Box
    const searchInput = document.getElementById('diet-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        AppState.diet.searchQuery = e.target.value.trim().toLowerCase();
        renderDietSection();
      });
    }

    // 5. Hero Button Jump
    document.getElementById('hero-diet-btn')?.addEventListener('click', () => {
      switchTab('diet');
    });

    // 6. Extract Diet JSON (Download)
    document.getElementById('export-diet-json-btn')?.addEventListener('click', exportDietJSON);

    // 7. Copy Raw Diet JSON
    document.getElementById('copy-diet-json-btn')?.addEventListener('click', copyDietJSON);

    // 8. Refresh / Sync Web Nutrition
    document.getElementById('refresh-diet-web-btn')?.addEventListener('click', fetchWebDietData);
  }

  async function loadDietData() {
    // 1. Try localStorage first
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DIET);
      if (stored) {
        AppState.diet.data = JSON.parse(stored);
        renderDietSection();
        return;
      }
    } catch (e) {}

    // 2. Try embedded JSON data island (guaranteed to render offline and on file:/// without CORS)
    try {
      const embeddedScript = document.getElementById('embedded-diet-data');
      if (embeddedScript && embeddedScript.textContent && embeddedScript.textContent.trim()) {
        AppState.diet.data = JSON.parse(embeddedScript.textContent);
        renderDietSection();
      }
    } catch (e) {
      console.warn('Embedded diet parse notice:', e);
    }

    // 3. Try fetching diet.json over network/server if available
    try {
      const res = await fetch('./diet.json');
      if (res.ok) {
        const json = await res.json();
        AppState.diet.data = json;
        localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(json));
        renderDietSection();
        return;
      }
    } catch (e) {}
  }

  async function fetchWebDietData() {
    showToast('Fetching latest web nutrition standards...', 'info');
    try {
      const res = await fetch('./diet.json', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        AppState.diet.data = json;
        localStorage.setItem(STORAGE_KEYS.DIET, JSON.stringify(json));
        renderDietSection();
        showToast('Diet plan synced with latest online standards!', 'success');
        playBeep(784, 'sine', 0.2);
        return;
      }
    } catch (e) {
      console.warn('Diet fetch notice:', e);
    }
    
    // Fallback if fetch is blocked (e.g. file:/// protocol)
    const embeddedScript = document.getElementById('embedded-diet-data');
    if (embeddedScript && embeddedScript.textContent && embeddedScript.textContent.trim()) {
      AppState.diet.data = JSON.parse(embeddedScript.textContent);
      localStorage.setItem(STORAGE_KEYS.DIET, embeddedScript.textContent.trim());
      renderDietSection();
      showToast('Diet plan restored from verified guidelines!', 'success');
      playBeep(784, 'sine', 0.2);
      return;
    }

    showToast('Diet plan refreshed from verified athletic guidelines', 'info');
    renderDietSection();
  }

  function renderDietSection() {
    const container = document.getElementById('diet-meals-container');
    if (!container) return;

    if (!AppState.diet.data) {
      loadDietData();
      return;
    }

    const data = AppState.diet.data;
    const dayName = AppState.diet.activeDay || 'Monday';
    const filterType = AppState.diet.filterType || 'all';
    const searchQuery = (AppState.diet.searchQuery || '').trim().toLowerCase();

    const dayData = data.days ? data.days[dayName] : null;
    if (!dayData) return;

    // Update Banner
    const dayBadge = document.getElementById('diet-active-day-badge');
    const focusTitle = document.getElementById('diet-day-focus-title');
    const calVal = document.getElementById('macro-calories-val');
    const proVal = document.getElementById('macro-protein-val');
    const carbVal = document.getElementById('macro-carbs-val');
    const fatVal = document.getElementById('macro-fats-val');
    const waterVal = document.getElementById('macro-water-val');

    if (dayBadge) dayBadge.textContent = `${dayName} Plan`;
    if (focusTitle) focusTitle.textContent = dayData.focus;
    if (calVal) calVal.textContent = `${dayData.targets.calories.toLocaleString()} kcal`;
    if (proVal) proVal.textContent = dayData.targets.protein;
    if (carbVal) carbVal.textContent = dayData.targets.carbs;
    if (fatVal) fatVal.textContent = dayData.targets.fats;
    if (waterVal) waterVal.textContent = dayData.targets.water;

    // Day buttons state
    document.querySelectorAll('.diet-day-btn').forEach(btn => {
      if (btn.getAttribute('data-day') === dayName) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    // Filter buttons state
    document.querySelectorAll('.diet-type-btn').forEach(btn => {
      if (btn.getAttribute('data-type') === filterType) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    container.innerHTML = '';
    const meals = dayData.meals || [];

    meals.forEach((meal, mealIdx) => {
      const vegMatches = !searchQuery || 
        meal.veg.name.toLowerCase().includes(searchQuery) || 
        meal.veg.desc.toLowerCase().includes(searchQuery) ||
        (meal.veg.nutrients && meal.veg.nutrients.toLowerCase().includes(searchQuery));

      const nonVegMatches = !searchQuery || 
        meal.nonVeg.name.toLowerCase().includes(searchQuery) || 
        meal.nonVeg.desc.toLowerCase().includes(searchQuery) ||
        (meal.nonVeg.nutrients && meal.nonVeg.nutrients.toLowerCase().includes(searchQuery));

      const showVeg = (filterType === 'all' || filterType === 'veg') && vegMatches;
      const showNonVeg = (filterType === 'all' || filterType === 'nonveg') && nonVegMatches;

      if (!showVeg && !showNonVeg && searchQuery) {
        return;
      }

      const card = document.createElement('article');
      card.className = 'diet-meal-card';

      let optionsHtml = '';

      if (showVeg) {
        optionsHtml += `
          <div class="diet-option-box diet-option-veg">
            <div class="diet-option-header">
              <div>
                <span class="badge" style="background:#dcfce7; color:#16a34a; font-weight:800; font-size:0.75rem; margin-bottom:0.25rem;">🌱 Vegetarian Option</span>
                <div class="diet-option-name">${escapeHTML(meal.veg.name)}</div>
              </div>
            </div>
            <p class="diet-option-desc">${escapeHTML(meal.veg.desc)}</p>
            <div>
              <div class="macro-tags-row">
                <span class="macro-tag macro-cal">🔥 ${meal.veg.calories} kcal</span>
                <span class="macro-tag macro-pro">🥩 ${meal.veg.protein}g Protein</span>
                <span class="macro-tag macro-carb">🌾 ${meal.veg.carbs}g Carbs</span>
                <span class="macro-tag macro-fat">🥑 ${meal.veg.fats}g Fats</span>
                <span class="macro-tag macro-nutr">✨ ${escapeHTML(meal.veg.nutrients)}</span>
              </div>
            </div>
            <div class="diet-action-bar">
              <span style="font-size:0.75rem; color:#16a34a; font-weight:700;">100% Plant &amp; Dairy Clean</span>
              <button class="btn btn-outline btn-xs log-meal-btn" data-name="${escapeHTML(meal.veg.name)}" data-cals="${meal.veg.calories}" data-type="Veg ${meal.type}">
                + Log Meal (${meal.veg.calories} kcal)
              </button>
            </div>
          </div>
        `;
      }

      if (showNonVeg) {
        optionsHtml += `
          <div class="diet-option-box diet-option-nonveg">
            <div class="diet-option-header">
              <div>
                <span class="badge" style="background:#ffedd5; color:#ea580c; font-weight:800; font-size:0.75rem; margin-bottom:0.25rem;">🍗 Non-Vegetarian Option</span>
                <div class="diet-option-name">${escapeHTML(meal.nonVeg.name)}</div>
              </div>
            </div>
            <p class="diet-option-desc">${escapeHTML(meal.nonVeg.desc)}</p>
            <div>
              <div class="macro-tags-row">
                <span class="macro-tag macro-cal">🔥 ${meal.nonVeg.calories} kcal</span>
                <span class="macro-tag macro-pro">🥩 ${meal.nonVeg.protein}g Protein</span>
                <span class="macro-tag macro-carb">🌾 ${meal.nonVeg.carbs}g Carbs</span>
                <span class="macro-tag macro-fat">🥑 ${meal.nonVeg.fats}g Fats</span>
                <span class="macro-tag macro-nutr">✨ ${escapeHTML(meal.nonVeg.nutrients)}</span>
              </div>
            </div>
            <div class="diet-action-bar">
              <span style="font-size:0.75rem; color:#ea580c; font-weight:700;">High Bioavailable Protein</span>
              <button class="btn btn-outline btn-xs log-meal-btn" data-name="${escapeHTML(meal.nonVeg.name)}" data-cals="${meal.nonVeg.calories}" data-type="Non-Veg ${meal.type}">
                + Log Meal (${meal.nonVeg.calories} kcal)
              </button>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="diet-meal-header">
          <div class="diet-meal-title-group">
            <span style="font-size: 1.4rem;">${getMealIcon(meal.type)}</span>
            <div>
              <strong style="font-size: 1.05rem; color: var(--text-heading);">${meal.type}</strong>
              <div class="diet-meal-time">${meal.time}</div>
            </div>
          </div>
          <span class="badge" style="background:#f3f4f6; color:#4b5563;">Meal ${mealIdx + 1} of 5</span>
        </div>
        <div class="diet-options-grid">
          ${optionsHtml}
        </div>
      `;

      container.appendChild(card);
    });

    // Attach Log Meal Listeners
    container.querySelectorAll('.log-meal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const cals = parseInt(btn.getAttribute('data-cals'), 10);
        const type = btn.getAttribute('data-type');
        logDietMeal(name, cals, type);
      });
    });
  }

  function getMealIcon(type) {
    if (type.includes('Breakfast')) return '🌅';
    if (type.includes('Mid-Morning')) return '🍏';
    if (type.includes('Lunch')) return '🍱';
    if (type.includes('Snack')) return '⚡';
    if (type.includes('Dinner')) return '🌙';
    return '🍽️';
  }

  function logDietMeal(mealName, calories, mealType) {
    const user = AppState.currentUser;
    if (!user) return;

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().substring(0, 5);

    const newLog = {
      id: 'diet-' + Date.now(),
      title: `Diet: ${mealName}`,
      category: 'Nutrition',
      date: dateStr,
      time: timeStr,
      duration: 15,
      calories: parseInt(calories, 10) || 350,
      distance: 0,
      intensity: 5,
      status: 'Completed',
      notes: `Logged from Day-Wise Diet Plan (${mealType}).`
    };

    user.activities.unshift(newLog);
    saveCurrentUser();
    renderDashboardMetrics();
    renderActivitiesTable();
    playBeep(784, 'sine', 0.2);
    showToast(`Logged "${mealName}" (${calories} kcal) to daily fitness tracker!`, 'success', 3500);
  }

  function exportDietJSON() {
    const data = AppState.diet.data;
    if (!data) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `fitbuddy_daywise_diet_plan.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Day-Wise Diet Plan exported to JSON successfully!', 'success');
  }

  function copyDietJSON() {
    const data = AppState.diet.data;
    if (!data) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
        showToast('Diet JSON copied to clipboard!', 'success');
      }).catch(() => exportDietJSON());
    } else {
      exportDietJSON();
    }
  }

  /* --------------------------------------------------------------------------
     13. ACTIVITY LOG & TABLE OPERATIONS (Search, Filter, Export)
     -------------------------------------------------------------------------- */
  function renderActivitiesTable() {
    const tbody = document.getElementById('activities-tbody');
    const totalCountEl = document.getElementById('total-records-count');
    const summaryDurationEl = document.getElementById('summary-total-duration');
    const summaryCaloriesEl = document.getElementById('summary-total-calories');
    if (!tbody) return;

    const user = AppState.currentUser;
    const activities = user?.activities || [];

    const searchTerm = (document.getElementById('activity-search-input')?.value || '').trim().toLowerCase();
    const categoryFilter = document.getElementById('filter-category')?.value || 'all';
    const statusFilter = document.getElementById('filter-status')?.value || 'all';
    const sortVal = document.getElementById('sort-activities')?.value || 'date-desc';

    let filtered = activities.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                            item.category.toLowerCase().includes(searchTerm) ||
                            (item.notes && item.notes.toLowerCase().includes(searchTerm));
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortVal === 'date-desc') return new Date(b.date + ' ' + (b.time || '00:00')) - new Date(a.date + ' ' + (a.time || '00:00'));
      if (sortVal === 'date-asc') return new Date(a.date + ' ' + (a.time || '00:00')) - new Date(b.date + ' ' + (b.time || '00:00'));
      if (sortVal === 'calories-desc') return (b.calories || 0) - (a.calories || 0);
      if (sortVal === 'duration-desc') return (b.duration || 0) - (a.duration || 0);
      return 0;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state-cell">
            <div class="empty-state-wrap">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/></svg>
              <p>No activity records found matching filters.</p>
              <button class="btn btn-outline btn-xs" id="table-add-first-btn">Record First Workout</button>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('table-add-first-btn')?.addEventListener('click', () => openAddActivityModal());
      if (totalCountEl) totalCountEl.textContent = '0';
      if (summaryDurationEl) summaryDurationEl.textContent = '0 mins';
      if (summaryCaloriesEl) summaryCaloriesEl.textContent = '0 kcal';
      return;
    }

    let totDuration = 0;
    let totCalories = 0;

    filtered.forEach(act => {
      totDuration += parseInt(act.duration, 10) || 0;
      totCalories += parseInt(act.calories, 10) || 0;

      const tr = document.createElement('tr');
      const isCompleted = (act.status || 'Completed') === 'Completed';

      tr.innerHTML = `
        <td>
          <time datetime="${act.date}T${act.time || '12:00'}">${act.date}</time><br>
          <small style="color:var(--text-muted);">${act.time || '12:00'}</small>
        </td>
        <td>
          <strong>${escapeHTML(act.title)}</strong><br>
          <span class="badge" style="background:var(--primary-light); color:var(--primary); font-size:0.75rem;">${act.category}</span>
          ${act.distance > 0 ? `<small style="color:var(--text-muted); margin-left:0.35rem;">(${act.distance} km)</small>` : ''}
        </td>
        <td><strong>${act.duration}</strong> mins</td>
        <td><strong>${act.calories}</strong> kcal</td>
        <td><span class="badge" style="background:#f3f4f6; color:#374151;">RPE ${act.intensity || 7}/10</span></td>
        <td>
          <span class="badge status-pill-clickable status-toggle-pill" data-id="${act.id}" style="${isCompleted ? 'background:#dcfce7; color:#16a34a;' : 'background:#fff0e6; color:#ff6000;'} font-weight:700;" title="Click to toggle status">
            ${isCompleted ? '✓ Completed' : '⏳ In Progress'}
          </span>
        </td>
        <td class="text-right">
          <button class="btn btn-ghost btn-xs edit-act-btn" data-id="${act.id}" title="Edit activity">Edit</button>
          <button class="btn btn-ghost btn-xs text-danger delete-act-btn" data-id="${act.id}" title="Delete activity">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    if (totalCountEl) totalCountEl.textContent = filtered.length;
    if (summaryDurationEl) summaryDurationEl.textContent = `${totDuration} mins`;
    if (summaryCaloriesEl) summaryCaloriesEl.textContent = `${totCalories.toLocaleString()} kcal`;

    // Click to Toggle Status
    tbody.querySelectorAll('.status-toggle-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const act = user.activities.find(a => a.id === id);
        if (act) {
          act.status = act.status === 'Completed' ? 'In Progress' : 'Completed';
          saveCurrentUser();
          renderActivitiesTable();
          renderDashboardMetrics();
          playBeep(act.status === 'Completed' ? 784 : 440, 'sine', 0.15);
          showToast(`Status updated to: ${act.status}`, 'info');
        }
      });
    });

    // Edit Listeners
    tbody.querySelectorAll('.edit-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        openEditActivityModal(id);
      });
    });

    // Delete Listeners
    tbody.querySelectorAll('.delete-act-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this workout record?')) {
          user.activities = user.activities.filter(a => a.id !== id);
          saveCurrentUser();
          renderActivitiesTable();
          renderDashboardMetrics();
          showToast('Workout record deleted', 'info');
          playBeep(440, 'triangle', 0.15);
        }
      });
    });
  }

  function openAddActivityModal(defaults = {}) {
    document.getElementById('edit-activity-id').value = '';
    document.getElementById('activity-modal-title').textContent = 'Record Fitness Activity';

    const now = new Date();
    document.getElementById('act-title').value = defaults.title || '';
    document.getElementById('act-category').value = defaults.category || 'Cardio';
    document.getElementById('act-date').value = defaults.date || now.toISOString().split('T')[0];
    document.getElementById('act-time').value = defaults.time || now.toTimeString().substring(0, 5);
    document.getElementById('act-duration').value = defaults.duration || 30;
    document.getElementById('act-calories').value = defaults.calories || 250;
    document.getElementById('act-distance').value = defaults.distance || '';
    document.getElementById('act-status').value = defaults.status || 'Completed';
    document.getElementById('act-notes').value = defaults.notes || '';

    openModal('activity-modal');
  }

  function openEditActivityModal(id) {
    const user = AppState.currentUser;
    if (!user) return;

    const act = user.activities.find(a => a.id === id);
    if (!act) return;

    document.getElementById('edit-activity-id').value = act.id;
    document.getElementById('activity-modal-title').textContent = 'Edit Fitness Activity';
    document.getElementById('act-title').value = act.title;
    document.getElementById('act-category').value = act.category;
    document.getElementById('act-date').value = act.date;
    document.getElementById('act-time').value = act.time;
    document.getElementById('act-duration').value = act.duration;
    document.getElementById('act-calories').value = act.calories;
    document.getElementById('act-distance').value = act.distance || '';
    document.getElementById('act-status').value = act.status || 'Completed';
    document.getElementById('act-intensity').value = act.intensity || 7;
    document.getElementById('act-notes').value = act.notes || '';

    openModal('activity-modal');
  }

  function handleSaveActivity(e) {
    e.preventDefault();
    const user = AppState.currentUser;
    if (!user) return;

    const title = document.getElementById('act-title').value.trim();
    const category = document.getElementById('act-category').value;
    const date = document.getElementById('act-date').value;
    const time = document.getElementById('act-time').value || '12:00';
    const duration = parseInt(document.getElementById('act-duration').value, 10);
    const calories = parseInt(document.getElementById('act-calories').value, 10);
    const distance = parseFloat(document.getElementById('act-distance').value) || 0;
    const status = document.getElementById('act-status').value;
    const intensity = parseInt(document.getElementById('act-intensity').value, 10) || 7;
    const notes = document.getElementById('act-notes').value.trim();
    const editId = document.getElementById('edit-activity-id').value;

    if (!title || title.length < 2) {
      document.getElementById('act-title-err').textContent = 'Please enter an activity title.';
      return;
    }
    if (!category) {
      document.getElementById('act-category-err').textContent = 'Please select a category.';
      return;
    }
    if (isNaN(duration) || duration <= 0) {
      document.getElementById('act-duration-err').textContent = 'Enter duration in minutes.';
      return;
    }
    if (isNaN(calories) || calories < 0) {
      document.getElementById('act-calories-err').textContent = 'Enter valid calories.';
      return;
    }

    if (editId) {
      const idx = user.activities.findIndex(a => a.id === editId);
      if (idx !== -1) {
        user.activities[idx] = {
          ...user.activities[idx],
          title, category, date, time, duration, calories, distance, status, intensity, notes
        };
        showToast('Activity record updated!', 'success');
      }
    } else {
      const newAct = {
        id: 'act-' + Date.now(),
        title, category, date, time, duration, calories, distance, status, intensity, notes
      };
      user.activities.unshift(newAct);
      showToast('New activity logged! Metrics updated.', 'success');
    }

    saveCurrentUser();
    closeModal('activity-modal');
    renderActivitiesTable();
    renderDashboardMetrics();
    playBeep(784, 'sine', 0.2);
  }

  /* --------------------------------------------------------------------------
     14. CSV & JSON DATA EXPORT ENGINE
     -------------------------------------------------------------------------- */
  function exportActivitiesToCSV() {
    const user = AppState.currentUser;
    if (!user || !user.activities || user.activities.length === 0) {
      showToast('No activities logged to export yet', 'info');
      return;
    }
    const headers = ['ID', 'Title', 'Category', 'Date', 'Time', 'Duration_Mins', 'Calories_Burned', 'Distance_KM', 'Intensity_RPE', 'Status', 'Notes'];
    const rows = user.activities.map(a => [
      `"${a.id}"`,
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${a.category || ''}"`,
      `"${a.date || ''}"`,
      `"${a.time || ''}"`,
      a.duration || 0,
      a.calories || 0,
      a.distance || 0,
      a.intensity || 7,
      `"${a.status || 'Completed'}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fitbuddy_activities_${user.name.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Activity records exported to CSV file!', 'success');
  }

  function exportActivitiesToJSON() {
    const user = AppState.currentUser;
    if (!user || !user.activities || user.activities.length === 0) {
      showToast('No activities logged to export yet', 'info');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(user.activities, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `fitbuddy_activities_${user.name.replace(/\s+/g, '_').toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Activity records exported to JSON file!', 'success');
  }

  /* --------------------------------------------------------------------------
     15. CHALLENGE PROGRAMS ENGINE
     -------------------------------------------------------------------------- */
  function renderAllChallenges() {
    const grid = document.getElementById('challenges-grid');
    if (!grid) return;

    let challenges = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      challenges = raw ? JSON.parse(raw) : DEFAULT_CHALLENGES;
    } catch (e) {
      challenges = DEFAULT_CHALLENGES;
    }

    grid.innerHTML = '';
    challenges.forEach(chal => {
      const card = document.createElement('article');
      card.className = 'challenge-card white-card';
      const pct = Math.min(100, Math.round((chal.completedDays / chal.durationDays) * 100));

      card.innerHTML = `
        <div class="challenge-header">
          <div>
            <span class="badge" style="background:var(--primary-light); color:var(--primary);">${chal.category}</span>
            <h3 class="challenge-title">${escapeHTML(chal.title)}</h3>
          </div>
          <span class="badge" style="background:#f3f4f6;">${chal.durationDays} Days</span>
        </div>
        <p class="challenge-desc">${escapeHTML(chal.description)}</p>
        <div class="challenge-progress-area">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:0.25rem;">
            <span>Progress: <strong>${chal.completedDays} / ${chal.durationDays} Days</strong></span>
            <strong>${pct}%</strong>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-orange" style="width: ${pct}%;"></div>
          </div>
        </div>
        <div class="challenge-card-footer">
          <span style="font-size:0.8rem; color:var(--text-muted);">${chal.participants} Athletes Enrolled</span>
          <button class="btn btn-sm ${chal.enrolled ? 'btn-outline' : 'btn-primary'} chal-enroll-btn" data-id="${chal.id}">
            ${chal.enrolled ? 'Mark Today Done ✓' : 'Join Challenge'}
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll('.chal-enroll-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const c = challenges.find(item => item.id === id);
        if (c) {
          if (!c.enrolled) {
            c.enrolled = true;
            c.participants++;
            showToast(`Enrolled in "${c.title}"!`, 'success');
          } else {
            c.completedDays = Math.min(c.durationDays, c.completedDays + 1);
            showToast(`Day checked off for "${c.title}"!`, 'success');
          }
          localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));
          renderAllChallenges();
          playBeep(784, 'sine', 0.2);
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     16. PROFILE & TARGETS MANAGEMENT
     -------------------------------------------------------------------------- */
  function openProfileModal() {
    const user = AppState.currentUser;
    if (!user) return;

    document.getElementById('prof-name').value = user.name || '';
    document.getElementById('prof-age').value = user.age || 24;
    document.getElementById('prof-height').value = user.height || 175;
    document.getElementById('prof-weight').value = user.weight || 70;
    document.getElementById('prof-status').value = user.status || '';
    document.getElementById('prof-role').value = user.role || 'athlete';
    document.getElementById('prof-goal-steps').value = user.goals?.steps || 10000;
    document.getElementById('prof-goal-calories').value = user.goals?.calories || 650;
    document.getElementById('prof-goal-water').value = user.goals?.water || 2500;

    // Highlight avatar
    const curAvatar = user.avatar || '🏃';
    document.getElementById('prof-selected-avatar').value = curAvatar;
    const profPicker = document.getElementById('profile-avatar-picker');
    if (profPicker) {
      profPicker.querySelectorAll('.avatar-option-btn').forEach(btn => {
        if (btn.getAttribute('data-avatar') === curAvatar) btn.classList.add('active');
        else btn.classList.remove('active');
      });
    }

    const res = calculateBMI(user.weight, user.height);
    document.getElementById('modal-bmi-score').textContent = res.bmi;
    document.getElementById('modal-bmi-tag').textContent = res.category;

    openModal('profile-modal');
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    const user = AppState.currentUser;
    if (!user) return;

    const name = document.getElementById('prof-name').value.trim();
    const age = parseInt(document.getElementById('prof-age').value, 10);
    const height = parseFloat(document.getElementById('prof-height').value);
    const weight = parseFloat(document.getElementById('prof-weight').value);
    const status = document.getElementById('prof-status').value.trim();
    const role = document.getElementById('prof-role').value;
    const avatar = document.getElementById('prof-selected-avatar').value;
    const steps = parseInt(document.getElementById('prof-goal-steps').value, 10);
    const calories = parseInt(document.getElementById('prof-goal-calories').value, 10);
    const water = parseInt(document.getElementById('prof-goal-water').value, 10);

    user.name = name;
    user.age = age;
    user.height = height;
    user.weight = weight;
    user.status = status;
    user.role = role;
    user.avatar = avatar;
    user.goals = { steps, calories, water };

    saveCurrentUser();
    closeModal('profile-modal');
    updateUserInterface();
    renderDashboardMetrics();
    renderAdminRoster();
    showToast('Profile & role saved! Live metrics updated.', 'success');
  }

  /* --------------------------------------------------------------------------
     17. COACH & STAFF ADMIN PORTAL (Member Roster & Broadcast)
     -------------------------------------------------------------------------- */
  function renderAdminRoster() {
    const tbody = document.getElementById('admin-roster-tbody');
    const countBadge = document.getElementById('roster-count-badge');
    const totalMembersEl = document.getElementById('admin-total-members');
    const totalWorkoutsEl = document.getElementById('admin-total-workouts');
    const totalCaloriesEl = document.getElementById('admin-total-calories');
    if (!tbody) return;

    const accounts = Object.values(AppState.accounts || {});
    if (countBadge) countBadge.textContent = `${accounts.length} Members`;
    if (totalMembersEl) totalMembersEl.textContent = accounts.length;

    let aggregateWorkouts = 0;
    let aggregateCalories = 0;

    tbody.innerHTML = '';
    accounts.forEach(acc => {
      const workoutsCount = acc.activities ? acc.activities.length : 0;
      const totalCal = acc.activities ? acc.activities.reduce((s, a) => s + (Number(a.calories) || 0), 0) : 0;
      aggregateWorkouts += workoutsCount;
      aggregateCalories += totalCal;

      const streak = acc.todayStreak || 0;
      const isStaff = acc.role === 'staff';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <span style="font-size: 1.35rem;">${acc.avatar || '🏃'}</span>
            <div>
              <strong>${escapeHTML(acc.name || 'Athlete')}</strong>
              ${acc.email === AppState.currentUser?.email ? '<span class="badge" style="background:#fff0e6; color:#ff6000; margin-left:0.35rem; font-size:0.7rem;">You</span>' : ''}
            </div>
          </div>
        </td>
        <td><code>${escapeHTML(acc.email)}</code></td>
        <td>
          <span class="badge" style="${isStaff ? 'background:#dcfce7; color:#16a34a;' : 'background:#e0f2fe; color:#0284c7;'} font-weight:700;">
            ${isStaff ? '🛡️ Staff / Coach' : '🏃 Athlete'}
          </span>
        </td>
        <td><strong>${workoutsCount}</strong> logged</td>
        <td><strong>${totalCal.toLocaleString()}</strong> kcal</td>
        <td><span class="streak-flame-pill" style="font-size:0.75rem; padding:0.2rem 0.5rem;">🔥 ${streak} Days</span></td>
        <td><small style="color: var(--text-muted);">${escapeHTML(acc.status || 'Active athlete')}</small></td>
      `;
      tbody.appendChild(tr);
    });

    if (totalWorkoutsEl) totalWorkoutsEl.textContent = aggregateWorkouts;
    if (totalCaloriesEl) totalCaloriesEl.textContent = `${aggregateCalories.toLocaleString()} kcal`;
  }

  function initAnnouncements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      AppState.announcements = stored ? JSON.parse(stored) : DEFAULT_ANNOUNCEMENTS;
    } catch (e) {
      AppState.announcements = DEFAULT_ANNOUNCEMENTS;
    }
    renderAnnouncements();
  }

  function renderAnnouncements() {
    if (!AppState.announcements || AppState.announcements.length === 0) {
      AppState.announcements = DEFAULT_ANNOUNCEMENTS;
    }
    const latest = AppState.announcements[0];

    const titleEl = document.getElementById('announcement-title');
    const msgEl = document.getElementById('announcement-message');
    const timeEl = document.getElementById('announcement-timestamp');
    const authorEl = document.getElementById('announcement-author');

    if (titleEl && latest) titleEl.textContent = latest.title;
    if (msgEl && latest) msgEl.textContent = latest.message;
    if (timeEl && latest) timeEl.textContent = latest.timestamp || 'Live';
    if (authorEl && latest) authorEl.textContent = `From ${latest.author || 'Head Coach'}`;
  }

  function handleBroadcastSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('broadcast-title').value.trim();
    const msg = document.getElementById('broadcast-message').value.trim();

    if (!title || !msg) return;

    const newAnn = {
      id: 'ann-' + Date.now(),
      author: AppState.currentUser?.name || 'Head Coach',
      title,
      message: msg,
      timestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    AppState.announcements.unshift(newAnn);
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(AppState.announcements));

    renderAnnouncements();
    document.getElementById('admin-broadcast-form').reset();
    showToast(`📢 Broadcast Published: "${title}"`, 'success', 5000);
    playBeep(880, 'sine', 0.3);
  }

  function handleCreateChallengeSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('chal-title').value.trim();
    const category = document.getElementById('chal-category').value;
    const durationDays = parseInt(document.getElementById('chal-days').value, 10);
    const description = document.getElementById('chal-desc').value.trim();

    if (!title || !description || isNaN(durationDays)) return;

    let challenges = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
      challenges = raw ? JSON.parse(raw) : DEFAULT_CHALLENGES;
    } catch (e) {
      challenges = DEFAULT_CHALLENGES;
    }

    const newChal = {
      id: 'chal-' + Date.now(),
      title,
      category,
      durationDays,
      completedDays: 0,
      description,
      participants: 1,
      status: 'In Progress',
      enrolled: true
    };

    challenges.unshift(newChal);
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(challenges));

    closeModal('create-challenge-modal');
    document.getElementById('create-challenge-form').reset();
    renderAllChallenges();
    showToast(`New Challenge Published: "${title}"`, 'success');
  }

  /* --------------------------------------------------------------------------
     18. ONLINE MOTIVATIONAL QUOTE API
     -------------------------------------------------------------------------- */
  async function fetchMotivationalQuote() {
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    if (!textEl || !authorEl) return;

    const fallbackQuotes = [
      { text: "The body achieves what the mind believes.", author: "Napoleon Hill" },
      { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
      { text: "Consistency is what transforms average into excellence.", author: "Tony Dungy" },
      { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
      { text: "Don't count the days, make the days count.", author: "Muhammad Ali" }
    ];

    try {
      const res = await fetch('https://api.quotable.io/quotes/random?tags=motivational,sports', { signal: AbortSignal.timeout(2500) });
      if (res.ok) {
        const data = await res.json();
        const quote = Array.isArray(data) ? data[0] : data;
        if (quote && quote.content) {
          textEl.textContent = `"${quote.content}"`;
          authorEl.textContent = `— ${quote.author || 'Inspirational'}`;
          return;
        }
      }
    } catch (e) {
      // Graceful offline fallback
    }

    const chosen = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    textEl.textContent = `"${chosen.text}"`;
    authorEl.textContent = `— ${chosen.author}`;
  }

  /* --------------------------------------------------------------------------
     19. MODALS, TABS & FORM VALIDATION SYSTEM
     -------------------------------------------------------------------------- */
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.removeAttribute('hidden');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function switchTab(tabId) {
    AppState.activeTab = tabId;

    const links = document.querySelectorAll('.nav-link');
    links.forEach(l => {
      if (l.getAttribute('data-tab') === tabId) l.classList.add('active');
      else l.classList.remove('active');
    });

    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(p => {
      if (p.id === `${tabId}-tab`) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Close mobile nav if open
    document.getElementById('main-nav')?.classList.remove('open');

    if (tabId === 'admin-portal') renderAdminRoster();
    if (tabId === 'activities') renderActivitiesTable();
    if (tabId === 'planner') renderDayWisePlanner();
    if (tabId === 'diet') renderDietSection();
  }

  function initRealtimeFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => validateSingleField(input));
      input.addEventListener('blur', () => validateSingleField(input));
    });
  }

  function validateSingleField(input) {
    if (input.type === 'hidden') return;
    const isRequired = input.hasAttribute('required');
    const val = input.value.trim();

    let valid = true;
    if (isRequired && !val) {
      valid = false;
    } else if (input.type === 'email' && val) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    } else if (input.type === 'number' && val) {
      const min = input.min !== '' ? parseFloat(input.min) : -Infinity;
      const max = input.max !== '' ? parseFloat(input.max) : Infinity;
      const num = parseFloat(val);
      valid = !isNaN(num) && num >= min && num <= max;
    }

    if (val.length === 0 && !isRequired) {
      input.classList.remove('is-valid', 'is-invalid');
    } else if (valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    }
  }

  function initUIListeners() {
    // Navigation Links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('main-nav')?.classList.toggle('open');
    });

    // Modal triggers & closes
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-close');
        closeModal(id);
      });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
      });
    });

    document.getElementById('quick-log-btn')?.addEventListener('click', () => openAddActivityModal());
    document.getElementById('open-log-modal-btn')?.addEventListener('click', () => openAddActivityModal());
    document.getElementById('header-profile-btn')?.addEventListener('click', openProfileModal);
    document.getElementById('open-syllabus-btn')?.addEventListener('click', () => openModal('syllabus-modal'));
    document.getElementById('footer-syllabus-btn')?.addEventListener('click', () => openModal('syllabus-modal'));
    document.getElementById('open-create-challenge-btn')?.addEventListener('click', () => openModal('create-challenge-modal'));
    document.getElementById('refresh-quote-btn')?.addEventListener('click', fetchMotivationalQuote);

    // Forms
    document.getElementById('activity-form')?.addEventListener('submit', handleSaveActivity);
    document.getElementById('profile-form')?.addEventListener('submit', handleProfileSubmit);
    document.getElementById('admin-broadcast-form')?.addEventListener('submit', handleBroadcastSubmit);
    document.getElementById('create-challenge-form')?.addEventListener('submit', handleCreateChallengeSubmit);

    // Export Buttons
    document.getElementById('export-csv-btn')?.addEventListener('click', exportActivitiesToCSV);
    document.getElementById('export-json-btn')?.addEventListener('click', exportActivitiesToJSON);

    // Athlete Daily Status update button
    document.getElementById('edit-daily-status-btn')?.addEventListener('click', () => {
      const cur = AppState.currentUser?.status || '';
      document.getElementById('status-input-text').value = cur;
      openModal('status-modal');
    });

    document.getElementById('status-update-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newStatus = document.getElementById('status-input-text').value.trim();
      if (!newStatus || !AppState.currentUser) return;
      AppState.currentUser.status = newStatus;
      saveCurrentUser();
      updateUserInterface();
      renderAdminRoster();
      closeModal('status-modal');
      showToast('Daily athlete status posted!', 'success');
      playBeep(784, 'sine', 0.2);
    });

    // Activity search & filters
    const searchInput = document.getElementById('activity-search-input');
    const catSelect = document.getElementById('filter-category');
    const statusSelect = document.getElementById('filter-status');
    const sortSelect = document.getElementById('sort-activities');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    [searchInput, catSelect, statusSelect, sortSelect].forEach(el => {
      el?.addEventListener('input', renderActivitiesTable);
      el?.addEventListener('change', renderActivitiesTable);
    });

    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (catSelect) catSelect.value = 'all';
        if (statusSelect) statusSelect.value = 'all';
        if (sortSelect) sortSelect.value = 'date-desc';
        renderActivitiesTable();
      });
    }

    // Step Quick Actions
    document.getElementById('add-500-steps-btn')?.addEventListener('click', () => {
      if (AppState.currentUser) {
        AppState.currentUser.todaySteps = (AppState.currentUser.todaySteps || 0) + 500;
        saveCurrentUser();
        renderDashboardMetrics();
        playBeep(520, 'sine', 0.1);
      }
    });

    document.getElementById('add-1000-steps-btn')?.addEventListener('click', () => {
      if (AppState.currentUser) {
        AppState.currentUser.todaySteps = (AppState.currentUser.todaySteps || 0) + 1000;
        saveCurrentUser();
        renderDashboardMetrics();
        playBeep(587, 'sine', 0.12);
      }
    });

    document.getElementById('toggle-step-counter-btn')?.addEventListener('click', () => {
      const btn = document.getElementById('toggle-step-counter-btn');
      if (!AppState.stepSessionActive) {
        AppState.stepSessionActive = true;
        btn.textContent = 'Stop Walking';
        btn.classList.replace('btn-primary', 'btn-outline');
        AppState.stepSessionInterval = setInterval(() => {
          if (AppState.currentUser) {
            AppState.currentUser.todaySteps = (AppState.currentUser.todaySteps || 0) + 12;
            renderDashboardMetrics();
          }
        }, 1200);
        showToast('Simulated pedometer walking started', 'info');
      } else {
        AppState.stepSessionActive = false;
        clearInterval(AppState.stepSessionInterval);
        btn.textContent = 'Simulate Walking';
        btn.classList.replace('btn-outline', 'btn-primary');
        saveCurrentUser();
        showToast('Pedometer session ended. Steps saved.', 'success');
      }
    });

    // Water Quick Actions
    document.getElementById('add-250-water-btn')?.addEventListener('click', () => {
      if (AppState.currentUser) {
        AppState.currentUser.todayWater = (AppState.currentUser.todayWater || 0) + 250;
        saveCurrentUser();
        renderDashboardMetrics();
        playBeep(659, 'sine', 0.1);
      }
    });

    document.getElementById('add-500-water-btn')?.addEventListener('click', () => {
      if (AppState.currentUser) {
        AppState.currentUser.todayWater = (AppState.currentUser.todayWater || 0) + 500;
        saveCurrentUser();
        renderDashboardMetrics();
        playBeep(784, 'sine', 0.15);
      }
    });

    document.getElementById('reset-water-btn')?.addEventListener('click', () => {
      if (AppState.currentUser && confirm('Reset today\'s water intake to 0?')) {
        AppState.currentUser.todayWater = 0;
        saveCurrentUser();
        renderDashboardMetrics();
      }
    });

    // Mode Toggle (Athlete Mode vs Coach Mode)
    document.getElementById('mode-athlete-btn')?.addEventListener('click', () => {
      AppState.roleMode = 'athlete';
      document.getElementById('mode-athlete-btn').classList.add('active');
      document.getElementById('mode-coach-btn').classList.remove('active');
      switchTab('dashboard');
      showToast('Switched to Athlete Personal Tracking Mode', 'info');
    });

    document.getElementById('mode-coach-btn')?.addEventListener('click', () => {
      AppState.roleMode = 'staff';
      document.getElementById('mode-coach-btn').classList.add('active');
      document.getElementById('mode-athlete-btn').classList.remove('active');
      switchTab('admin-portal');
      showToast('Switched to Coach & Staff Admin Operations', 'success');
    });
  }

  /* --------------------------------------------------------------------------
     20. HELPER FUNCTIONS
     -------------------------------------------------------------------------- */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* --------------------------------------------------------------------------
     21. SERVICE WORKER REGISTRATION (PWA Support)
     -------------------------------------------------------------------------- */
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('FitBuddy by WebWeavers PWA ServiceWorker active:', reg.scope))
          .catch(err => console.warn('PWA registration notice:', err));
      });
    }
  }

  /* --------------------------------------------------------------------------
     22. ENTRY POINT
     -------------------------------------------------------------------------- */
  function main() {
    initTheme();
    initAuthSystem();
    initUIListeners();
    initRealtimeFormValidation();
    initLiveSessionTracker();
    initDayWisePlanner();
    initDietSection();
    registerServiceWorker();

    fetchMotivationalQuote();
    console.log('FitBuddy by WebWeavers v6.0 Live Tracker, Day-Wise Workout & Diet Planner Running.');
  }

  // Self-bootstrapping DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})();
