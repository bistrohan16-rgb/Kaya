import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Dumbbell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const PLANS_DATA = {
  football: { name: "Football", emoji: "⚽", plans: [
    { name: "Hamstring Injury Prevention", type: "prehab", duration: 12, exercises: [
      { name: "Nordic Curls", sets: 3, reps: 8, area: "Hamstrings", desc: "Kneel, anchor feet, lower slowly with full control. The eccentric load is key." },
      { name: "Romanian Deadlift", sets: 3, reps: 10, area: "Hamstrings", desc: "Hinge at hips, keep back flat, feel the stretch at the bottom." },
      { name: "Hip Flexor Stretch", sets: 2, duration: 40, area: "Hips", desc: "Lunge position, push hips forward, hold." },
      { name: "Glute Bridge", sets: 3, reps: 15, area: "Glutes", desc: "Drive through heels, squeeze at the top for 2 seconds." },
    ]},
    { name: "ACL Prevention Protocol", type: "prehab", duration: 18, exercises: [
      { name: "Single Leg Squat", sets: 3, reps: 10, area: "Knees", desc: "Control the descent, knee tracks over second toe." },
      { name: "Lateral Band Walk", sets: 3, reps: 15, area: "Hips/Knees", desc: "Band around ankles, stay low, small controlled steps." },
      { name: "Box Jump Landing", sets: 3, reps: 8, area: "Knees", desc: "Land softly on both feet, absorb through hips and knees." },
      { name: "Copenhagen Plank", sets: 3, duration: 20, area: "Groin", desc: "Side plank with top leg on bench, lift bottom leg." },
    ]},
    { name: "Groin & Adductor Care", type: "prehab", duration: 10, exercises: [
      { name: "Adductor Squeeze", sets: 3, reps: 15, area: "Groin", desc: "Ball between knees, squeeze for 3 seconds each rep." },
      { name: "Side Lunge Stretch", sets: 2, duration: 30, area: "Groin", desc: "Wide stance, shift weight to one side, keep other leg straight." },
      { name: "Copenhagen Plank", sets: 3, duration: 20, area: "Groin", desc: "Progressive loading for adductor strength." },
    ]},
    { name: "Pre-Match Warmup", type: "warmup", duration: 10, exercises: [
      { name: "High Knees", sets: 2, duration: 30, area: "Full Body", desc: "Drive knees to hip height, stay on balls of feet." },
      { name: "Leg Swings", sets: 2, reps: 12, area: "Hips", desc: "10 forward/back then 10 lateral each leg." },
      { name: "Dynamic Quad Stretch", sets: 2, reps: 10, area: "Quads", desc: "Walking, pull heel to glute each step." },
      { name: "Calf Raises", sets: 2, reps: 20, area: "Calves", desc: "Slow and controlled, full range." },
    ]},
    { name: "Post-Match Recovery", type: "cooldown", duration: 12, exercises: [
      { name: "Hamstring Stretch", sets: 2, duration: 45, area: "Hamstrings", desc: "Seated, reach toward toes, hold." },
      { name: "Quad Stretch", sets: 2, duration: 30, area: "Quads", desc: "Standing, pull heel to glute." },
      { name: "IT Band Foam Roll", sets: 1, duration: 60, area: "IT Band", desc: "Slow roll from hip to knee, pause on tight spots." },
    ]},
  ]},
  rugby: { name: "Rugby", emoji: "🏉", plans: [
    { name: "Neck & Scrum Prep", type: "prehab", duration: 15, exercises: [
      { name: "Neck Strengthening Isometric", sets: 3, reps: 10, area: "Neck", desc: "Hand on forehead/temple, resist with neck muscles for 5 seconds each." },
      { name: "Trap Stretch", sets: 2, duration: 30, area: "Neck/Traps", desc: "Tilt head to one side, hand on opposite shoulder, gentle pull." },
      { name: "Shoulder Shrugs", sets: 3, reps: 15, area: "Traps", desc: "Loaded or unloaded, slow circles." },
      { name: "Chin Tuck", sets: 3, reps: 12, area: "Neck", desc: "Tuck chin in, hold 3 seconds. Strengthens deep neck flexors." },
    ]},
    { name: "Shoulder Contact Prep", type: "prehab", duration: 18, exercises: [
      { name: "Rotator Cuff External Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow height, rotate outward, control back." },
      { name: "Scapular Push-Up", sets: 3, reps: 12, area: "Shoulders", desc: "Plank position, protract and retract shoulder blades only." },
      { name: "Face Pull", sets: 3, reps: 15, area: "Rear Delt", desc: "Band at face height, pull to nose, elbows high." },
      { name: "Sleeper Stretch", sets: 2, duration: 30, area: "Shoulders", desc: "Lie on side, rotate arm down, gentle pressure with other hand." },
    ]},
    { name: "Lower Body Power", type: "prehab", duration: 15, exercises: [
      { name: "Hip Thrust", sets: 3, reps: 12, area: "Glutes", desc: "Shoulders on bench, drive hips up, squeeze at top." },
      { name: "Bulgarian Split Squat", sets: 3, reps: 10, area: "Quads/Glutes", desc: "Rear foot elevated, drop straight down." },
      { name: "Hamstring Curl", sets: 3, reps: 12, area: "Hamstrings", desc: "Prone or Nordic variation." },
    ]},
    { name: "Pre-Match Activation", type: "warmup", duration: 10, exercises: [
      { name: "Neck Circles", sets: 1, duration: 30, area: "Neck", desc: "Slow controlled circles in both directions." },
      { name: "Shoulder Rolls", sets: 1, duration: 30, area: "Shoulders", desc: "Large backward then forward circles." },
      { name: "Hip Mobility Flow", sets: 2, duration: 40, area: "Hips", desc: "90/90 hip rotations on floor." },
      { name: "Lateral Shuffle", sets: 2, duration: 20, area: "Full Body", desc: "Low athletic stance, quick lateral steps." },
    ]},
  ]},
  running: { name: "Running", emoji: "🏃", plans: [
    { name: "Runner's Knee Prevention", type: "prehab", duration: 15, exercises: [
      { name: "IT Band Foam Roll", sets: 2, duration: 60, area: "IT Band/Knees", desc: "Side lying, roll slowly from hip to knee. Pause on tight areas." },
      { name: "Clamshell", sets: 3, reps: 15, area: "Glutes/Hips", desc: "Side lying, feet together, lift top knee like a clamshell." },
      { name: "Step Down", sets: 3, reps: 10, area: "Knees", desc: "Single leg on step, lower opposite foot slowly." },
      { name: "Vastus Medialis Squeeze", sets: 3, reps: 15, area: "Knees", desc: "Terminal knee extension with band." },
    ]},
    { name: "Shin Splint Prevention", type: "prehab", duration: 12, exercises: [
      { name: "Calf Raises", sets: 4, reps: 20, area: "Calves", desc: "Eccentric focus — go up on two feet, down on one." },
      { name: "Tibialis Anterior Raise", sets: 3, reps: 20, area: "Shins", desc: "Heels on floor, raise toes up toward ceiling." },
      { name: "Ankle Circles", sets: 2, duration: 30, area: "Ankles", desc: "Full circles both directions, slow and controlled." },
      { name: "Foot Doming", sets: 3, reps: 15, area: "Foot Arch", desc: "Press toes down without curling them, create a dome with foot arch." },
    ]},
    { name: "Plantar Fasciitis Care", type: "rehab", duration: 10, exercises: [
      { name: "Calf Stretch", sets: 3, duration: 45, area: "Calves/Plantar", desc: "Wall stretch, both straight and bent knee versions." },
      { name: "Towel Scrunch", sets: 3, reps: 20, area: "Foot", desc: "Scrunch towel with toes, builds intrinsic foot strength." },
      { name: "Marble Pickup", sets: 2, reps: 15, area: "Foot", desc: "Pick up marbles with toes, builds arch control." },
      { name: "Frozen Bottle Roll", sets: 1, duration: 120, area: "Plantar Fascia", desc: "Roll foot over frozen water bottle for relief and mobility." },
    ]},
    { name: "Pre-Run Activation", type: "warmup", duration: 8, exercises: [
      { name: "Leg Swings", sets: 2, reps: 15, area: "Hips", desc: "Forward/back and lateral swings, hold a wall for balance." },
      { name: "Hip Circles", sets: 2, reps: 10, area: "Hips", desc: "Large circles in both directions." },
      { name: "Ankle Bounces", sets: 2, duration: 20, area: "Ankles/Calves", desc: "Small fast bounces on spot, stay on balls of feet." },
      { name: "Glute Activation", sets: 2, reps: 15, area: "Glutes", desc: "Donkey kicks or clamshells to wake up glutes before running." },
    ]},
    { name: "Post-Run Recovery", type: "cooldown", duration: 12, exercises: [
      { name: "Standing Quad Stretch", sets: 2, duration: 40, area: "Quads", desc: "Hold ankle, knee points down, stand tall." },
      { name: "Pigeon Pose", sets: 2, duration: 45, area: "Hips", desc: "Figure 4 on the ground, lean forward for deeper stretch." },
      { name: "Calf Stretch on Wall", sets: 2, duration: 40, area: "Calves", desc: "Hands on wall, heel down, feel the stretch." },
    ]},
  ]},
  basketball: { name: "Basketball", emoji: "🏀", plans: [
    { name: "Ankle Stability", type: "prehab", duration: 12, exercises: [
      { name: "Single Leg Balance", sets: 3, duration: 30, area: "Ankles", desc: "Eyes closed for progression. Control wobble without touching down." },
      { name: "Band Ankle Eversion", sets: 3, reps: 15, area: "Ankles", desc: "Band around foot, rotate outward against resistance." },
      { name: "Calf Raises", sets: 3, reps: 20, area: "Calves", desc: "Eccentric focus — 3 seconds down." },
      { name: "Lateral Hops", sets: 3, reps: 10, area: "Ankles/Knees", desc: "Small controlled hops side to side, land softly." },
    ]},
    { name: "Jump Training Prep", type: "warmup", duration: 15, exercises: [
      { name: "Hip Flexor Stretch", sets: 2, duration: 30, area: "Hips", desc: "Kneeling lunge, push hips forward." },
      { name: "Glute Activation", sets: 2, reps: 15, area: "Glutes", desc: "Banded clamshells or hip thrusts." },
      { name: "Box Step-Up", sets: 3, reps: 10, area: "Quads/Glutes", desc: "Single leg, control the lowering phase." },
      { name: "Squat Jump", sets: 3, reps: 8, area: "Full Body", desc: "Land softly, absorb through hips and knees." },
    ]},
    { name: "Shoulder & Wrist Care", type: "prehab", duration: 10, exercises: [
      { name: "Wrist Circles", sets: 2, duration: 30, area: "Wrists", desc: "Full range of motion, both directions." },
      { name: "Wrist Flexor Stretch", sets: 2, duration: 30, area: "Wrists", desc: "Arm out, fingers down, gentle pull with other hand." },
      { name: "Shoulder Internal Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow height, rotate inward with control." },
    ]},
  ]},
  tennis: { name: "Tennis", emoji: "🎾", plans: [
    { name: "Shoulder Maintenance", type: "prehab", duration: 15, exercises: [
      { name: "Internal Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow height, rotate inward, control the return." },
      { name: "External Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow height, rotate outward. Critical for balance." },
      { name: "Sleeper Stretch", sets: 3, duration: 30, area: "Shoulders", desc: "Lie on serving side, internally rotate arm, gentle pressure." },
      { name: "Scapular Squeezes", sets: 3, reps: 15, area: "Upper Back", desc: "Pull shoulder blades together and down, hold 3 seconds." },
    ]},
    { name: "Tennis Elbow Prevention", type: "prehab", duration: 10, exercises: [
      { name: "Wrist Extension", sets: 3, reps: 15, area: "Forearm", desc: "Palm down, light weight, raise wrist slowly." },
      { name: "Wrist Flexion", sets: 3, reps: 15, area: "Forearm", desc: "Palm up, light weight, curl wrist up slowly." },
      { name: "Forearm Pronation/Supination", sets: 3, reps: 15, area: "Forearm", desc: "Rotate forearm palm up to palm down with control." },
      { name: "Grip Squeeze", sets: 3, reps: 20, area: "Hand/Forearm", desc: "Squeeze stress ball for grip endurance." },
    ]},
    { name: "Lower Body Court Movement", type: "warmup", duration: 10, exercises: [
      { name: "Lateral Shuffle", sets: 3, duration: 20, area: "Hips/Ankles", desc: "Low stance, quick lateral steps, stay on balls of feet." },
      { name: "Split Step Practice", sets: 3, reps: 10, area: "Ankles", desc: "Small jump, land in athletic position, ready to move." },
      { name: "Hip External Rotation", sets: 2, duration: 30, area: "Hips", desc: "Seated figure 4 stretch, lean forward for intensity." },
    ]},
  ]},
  swimming: { name: "Swimming", emoji: "🏊", plans: [
    { name: "Shoulder Mobility", type: "mobility", duration: 15, exercises: [
      { name: "Band Pull-Apart", sets: 3, reps: 15, area: "Rear Delt/Upper Back", desc: "Arms straight, pull band to chest, squeeze shoulder blades." },
      { name: "Thoracic Rotation", sets: 3, duration: 30, area: "Upper Back", desc: "Seated, rotate through thoracic spine not lower back." },
      { name: "Lat Stretch", sets: 2, duration: 40, area: "Lats", desc: "Arms overhead on door frame or pole, lean away." },
      { name: "Doorway Chest Stretch", sets: 2, duration: 30, area: "Chest", desc: "Arm on door frame at 90 degrees, gently rotate away." },
    ]},
    { name: "Rotator Cuff Strengthening", type: "prehab", duration: 12, exercises: [
      { name: "Y-T-W-L", sets: 3, reps: 10, area: "Shoulders", desc: "Prone on bench, make each letter shape with arms. Light weight." },
      { name: "Side-Lying External Rotation", sets: 3, reps: 15, area: "Rotator Cuff", desc: "Arm at side, rotate upward, slow and controlled." },
      { name: "Prone Cobra", sets: 3, duration: 20, area: "Upper Back", desc: "Lift chest and arms, squeeze shoulder blades, thumbs up." },
    ]},
    { name: "Knee Breaststroke Care", type: "prehab", duration: 10, exercises: [
      { name: "Clamshell", sets: 3, reps: 15, area: "Hips", desc: "Targets medial knee stress from breaststroke kick." },
      { name: "Quad Stretch", sets: 2, duration: 40, area: "Quads", desc: "Prone, pull heel to glute." },
      { name: "IT Band Stretch", sets: 2, duration: 30, area: "IT Band", desc: "Cross one leg behind the other, lean away." },
    ]},
  ]},
  cycling: { name: "Cycling", emoji: "🚴", plans: [
    { name: "Cyclist Hip Opener", type: "prehab", duration: 15, exercises: [
      { name: "Hip Flexor Stretch", sets: 3, duration: 45, area: "Hips", desc: "Kneeling lunge, push hips forward, keep torso upright." },
      { name: "Pigeon Pose", sets: 2, duration: 60, area: "Hips/Glutes", desc: "Deep hip opener, walk hands forward for more intensity." },
      { name: "90/90 Hip Stretch", sets: 2, duration: 40, area: "Hips", desc: "Both legs at 90 degrees on floor, rotate between sides." },
      { name: "Thomas Test Stretch", sets: 2, duration: 30, area: "Hip Flexors", desc: "Lie on edge of table, pull one knee to chest, other leg hangs." },
    ]},
    { name: "Knee Tracking", type: "prehab", duration: 12, exercises: [
      { name: "VMO Activation", sets: 3, reps: 15, area: "Knees", desc: "Terminal knee extension to target inner quad." },
      { name: "Step Down", sets: 3, reps: 10, area: "Knees", desc: "Single leg on step, lower slowly, knee tracks over toe." },
      { name: "Foam Roll Quads", sets: 1, duration: 60, area: "Quads", desc: "Slow roll front of thigh, pause on tight areas." },
    ]},
    { name: "Lower Back Care", type: "prehab", duration: 12, exercises: [
      { name: "Cat-Cow", sets: 3, reps: 12, area: "Lower Back", desc: "Slow rhythm, full range of movement through spine." },
      { name: "Child's Pose", sets: 2, duration: 45, area: "Lower Back", desc: "Arms extended, breathe into lower back." },
      { name: "Bird Dog", sets: 3, reps: 10, area: "Core/Lower Back", desc: "Opposite arm and leg, hold 3 seconds, stable spine." },
      { name: "Glute Bridge", sets: 3, reps: 15, area: "Glutes/Lower Back", desc: "Activates glutes which take load off lower back." },
    ]},
  ]},
  weightlifting: { name: "Weightlifting", emoji: "🏋️", plans: [
    { name: "Powerlifting Warm-Up", type: "warmup", duration: 15, exercises: [
      { name: "Hip Mobility Flow", sets: 2, duration: 45, area: "Hips", desc: "90/90 hip rotations, deep squat holds, hip circles." },
      { name: "Thoracic Extension", sets: 3, duration: 30, area: "Upper Back", desc: "Foam roller under thoracic spine, extend over it." },
      { name: "Ankle Mobility", sets: 2, duration: 30, area: "Ankles", desc: "Knee to wall, increase range gradually." },
      { name: "Band Shoulder Dislocates", sets: 2, reps: 10, area: "Shoulders", desc: "Band overhead and back, keep arms straight." },
    ]},
    { name: "Lower Back Protection", type: "prehab", duration: 15, exercises: [
      { name: "Dead Bug", sets: 3, reps: 10, area: "Core", desc: "Maintain lower back pressed to floor throughout." },
      { name: "Pallof Press", sets: 3, reps: 12, area: "Core", desc: "Anti-rotation press, resist the band pulling you sideways." },
      { name: "McGill Big 3", sets: 3, duration: 30, area: "Core/Lower Back", desc: "Modified curl-up, bird dog, side plank." },
    ]},
    { name: "Shoulder Health", type: "prehab", duration: 12, exercises: [
      { name: "Band Face Pull", sets: 3, reps: 20, area: "Rear Delt", desc: "Essential for bench press shoulder balance." },
      { name: "External Rotation", sets: 3, reps: 15, area: "Rotator Cuff", desc: "Band at elbow height, rotate outward slowly." },
      { name: "Pec Minor Stretch", sets: 2, duration: 30, area: "Chest/Shoulders", desc: "Arm on wall at 90 degrees, rotate body away." },
    ]},
  ]},
  cricket: { name: "Cricket", emoji: "🏏", plans: [
    { name: "Bowling Shoulder Prep", type: "prehab", duration: 15, exercises: [
      { name: "External Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow, rotate outward. Critical for bowling action." },
      { name: "Sleeper Stretch", sets: 3, duration: 30, area: "Posterior Shoulder", desc: "Essential for bowlers — targets posterior shoulder capsule." },
      { name: "Serratus Activation", sets: 3, reps: 12, area: "Shoulder Stability", desc: "Wall slides or serratus push-up." },
      { name: "Wrist Strengthening", sets: 3, reps: 15, area: "Wrist/Forearm", desc: "Wrist curls and extensions with light weight." },
    ]},
    { name: "Batsman Lower Body", type: "prehab", duration: 12, exercises: [
      { name: "Lateral Lunge", sets: 3, reps: 10, area: "Hips/Groin", desc: "Wide step to side, sit into hip, knee tracks toe." },
      { name: "Hip 90/90", sets: 2, duration: 40, area: "Hips", desc: "Address position hip mobility." },
      { name: "Calf Raises", sets: 3, reps: 20, area: "Calves", desc: "Running between wickets calf endurance." },
    ]},
    { name: "Lower Back Stress", type: "prehab", duration: 12, exercises: [
      { name: "Cat-Cow", sets: 3, reps: 12, area: "Spine", desc: "Especially important for fast bowlers." },
      { name: "Bird Dog", sets: 3, reps: 10, area: "Core", desc: "Spine stability for bowling load." },
      { name: "Glute Bridge", sets: 3, reps: 15, area: "Glutes/Lower Back", desc: "Offloads lumbar spine during bowling." },
    ]},
  ]},
  boxing: { name: "Boxing", emoji: "🥊", plans: [
    { name: "Hand & Wrist Care", type: "prehab", duration: 10, exercises: [
      { name: "Wrist Rotations", sets: 2, duration: 30, area: "Wrists", desc: "Full circles both directions, increase speed gradually." },
      { name: "Grip Squeeze", sets: 3, reps: 20, area: "Hand/Forearm", desc: "Stress ball or towel squeeze for punch endurance." },
      { name: "Wrist Flexor Stretch", sets: 2, duration: 30, area: "Wrists", desc: "Arm straight, palm down, gently pull fingers up." },
    ]},
    { name: "Shoulder Punching Prep", type: "prehab", duration: 15, exercises: [
      { name: "Rotator Cuff Circuit", sets: 3, reps: 12, area: "Shoulders", desc: "Internal + external rotation + abduction with bands." },
      { name: "Scapular Wall Slide", sets: 3, reps: 12, area: "Shoulders/Upper Back", desc: "Back to wall, slide arms up and down, control movement." },
      { name: "Band Pull-Apart", sets: 3, reps: 20, area: "Rear Delt", desc: "Counter-balance for all the pushing in boxing." },
    ]},
    { name: "Neck Strengthening", type: "prehab", duration: 10, exercises: [
      { name: "Neck Isometrics", sets: 3, reps: 10, area: "Neck", desc: "All 4 directions — resist movement with hand, hold 5 seconds." },
      { name: "Trap Stretch", sets: 2, duration: 30, area: "Neck/Traps", desc: "Essential for punch impact absorption." },
      { name: "Chin Tuck", sets: 3, reps: 12, area: "Neck", desc: "Strengthens deep neck flexors for head stability." },
    ]},
  ]},
  hockey: { name: "Hockey", emoji: "🏑", plans: [
    { name: "Low Back & Hip Care", type: "prehab", duration: 15, exercises: [
      { name: "Hip Flexor Stretch", sets: 3, duration: 40, area: "Hips", desc: "Kneeling, push hips forward. Constant hip flexion in hockey posture stiffens these." },
      { name: "Thoracic Rotation", sets: 3, duration: 30, area: "Upper Back", desc: "Rotate through upper back for stick skills." },
      { name: "Pigeon Pose", sets: 2, duration: 45, area: "Hips/Glutes", desc: "Deep hip opener for skating/running position." },
      { name: "Cat-Cow", sets: 3, reps: 12, area: "Lower Back", desc: "Counters the constant forward lean of hockey posture." },
    ]},
    { name: "Hamstring & Groin", type: "prehab", duration: 12, exercises: [
      { name: "Nordic Curls", sets: 3, reps: 8, area: "Hamstrings", desc: "Eccentric strength for explosive skating movements." },
      { name: "Copenhagen Plank", sets: 3, duration: 20, area: "Groin", desc: "Adductor loading for groin strain prevention." },
      { name: "Adductor Stretch", sets: 2, duration: 40, area: "Groin", desc: "Wide stance, shift weight side to side." },
    ]},
  ]},
  volleyball: { name: "Volleyball", emoji: "🏐", plans: [
    { name: "Shoulder Spiking Prep", type: "prehab", duration: 15, exercises: [
      { name: "External Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow, critical for serving and spiking health." },
      { name: "Posterior Shoulder Stretch", sets: 2, duration: 30, area: "Shoulders", desc: "Cross-body stretch, hold with other arm." },
      { name: "Serratus Anterior", sets: 3, reps: 12, area: "Shoulder Blade", desc: "Wall push-up plus — protract at top of movement." },
    ]},
    { name: "Ankle & Jump Landing", type: "prehab", duration: 12, exercises: [
      { name: "Single Leg Landing", sets: 3, reps: 10, area: "Ankles/Knees", desc: "Land on one foot from a step, control the wobble." },
      { name: "Band Ankle Inversion", sets: 3, reps: 15, area: "Ankles", desc: "Band around foot, rotate inward against resistance." },
      { name: "Calf Raises", sets: 4, reps: 20, area: "Calves", desc: "Eccentric focus for landing force absorption." },
    ]},
  ]},
  rowing: { name: "Rowing", emoji: "🚣", plans: [
    { name: "Lower Back Rowing Care", type: "prehab", duration: 15, exercises: [
      { name: "McGill Big 3", sets: 3, duration: 30, area: "Core/Lower Back", desc: "Modified curl-up, bird dog, side plank." },
      { name: "Thoracic Extension", sets: 3, duration: 30, area: "Upper Back", desc: "Foam roller under thoracic spine." },
      { name: "Hip Hinge Pattern", sets: 3, reps: 12, area: "Lower Back/Hips", desc: "Practice clean hip hinge to protect lumbar in catch position." },
    ]},
    { name: "Knee Compression Care", type: "prehab", duration: 12, exercises: [
      { name: "VMO Strengthening", sets: 3, reps: 15, area: "Knees", desc: "Terminal knee extension targeting inner quad." },
      { name: "Step Down", sets: 3, reps: 10, area: "Knees", desc: "Single leg, control descent, knee tracks forward." },
      { name: "Quad Stretch", sets: 2, duration: 40, area: "Quads", desc: "Full knee flexion demand in rowing." },
    ]},
  ]},
  athletics: { name: "Athletics", emoji: "🏅", plans: [
    { name: "Sprint Prep", type: "prehab", duration: 15, exercises: [
      { name: "A-Skip Drills", sets: 3, duration: 20, area: "Hips/Ankles", desc: "High knee skip, drive arms, dorsiflect foot." },
      { name: "Hip Flexor Activation", sets: 3, reps: 12, area: "Hips", desc: "Banded hip flexion in standing." },
      { name: "Hamstring Eccentric", sets: 3, reps: 8, area: "Hamstrings", desc: "Nordic curls or slide board curls for sprint safety." },
      { name: "Ankle Stability", sets: 3, duration: 30, area: "Ankles", desc: "Single leg balance, eyes closed progression." },
    ]},
    { name: "Jump Event Prep", type: "prehab", duration: 12, exercises: [
      { name: "Achilles Loading", sets: 3, reps: 15, area: "Achilles", desc: "Eccentric calf raises on step edge." },
      { name: "Hip Thrust", sets: 3, reps: 12, area: "Glutes", desc: "Power development for jumping events." },
      { name: "Knee to Wall", sets: 3, reps: 10, area: "Ankles", desc: "Ankle dorsiflexion for landing mechanics." },
    ]},
  ]},
  martial_arts: { name: "Martial Arts", emoji: "🥋", plans: [
    { name: "Joint Mobility Flow", type: "warmup", duration: 15, exercises: [
      { name: "Neck Circles", sets: 2, duration: 30, area: "Neck", desc: "Slow full circles, both directions." },
      { name: "Shoulder Circles", sets: 2, duration: 30, area: "Shoulders", desc: "Large controlled arm circles." },
      { name: "Hip Circles", sets: 2, reps: 10, area: "Hips", desc: "Large circles, open and close hip." },
      { name: "Ankle Circles", sets: 2, duration: 20, area: "Ankles", desc: "Full range, both directions." },
    ]},
    { name: "Grappling Shoulder Care", type: "prehab", duration: 12, exercises: [
      { name: "Rotator Cuff Circuit", sets: 3, reps: 15, area: "Shoulders", desc: "Band internal, external rotation and abduction." },
      { name: "Bicep Tendon Care", sets: 3, reps: 15, area: "Biceps Tendon", desc: "Eccentric curls, slow lowering phase." },
      { name: "Wrist Prep", sets: 2, duration: 30, area: "Wrists", desc: "Full wrist circles, grip work." },
    ]},
    { name: "Hip Flexibility", type: "mobility", duration: 15, exercises: [
      { name: "Deep Squat Hold", sets: 3, duration: 45, area: "Hips/Ankles", desc: "Heels down, use pole for support if needed." },
      { name: "Pancake Stretch", sets: 2, duration: 60, area: "Hips/Hamstrings", desc: "Legs wide, fold forward. Walk hands out." },
      { name: "Lateral Lunge", sets: 3, reps: 10, area: "Groin/Hips", desc: "Wide stance lunge, deep sit into hip." },
    ]},
  ]},
  netball: { name: "Netball", emoji: "🏀", plans: [
    { name: "Knee Landing Mechanics", type: "prehab", duration: 12, exercises: [
      { name: "Single Leg Landing", sets: 3, reps: 10, area: "Knees/Ankles", desc: "Netball requires sudden stops — train landing control." },
      { name: "Lateral Band Walk", sets: 3, reps: 15, area: "Hips/Knees", desc: "Band around ankles, stay low, controlled steps." },
      { name: "Single Leg Squat", sets: 3, reps: 10, area: "Knees", desc: "Control the descent, knee tracks over toe." },
    ]},
    { name: "Shoulder Throwing Prep", type: "prehab", duration: 12, exercises: [
      { name: "External Rotation", sets: 3, reps: 15, area: "Shoulders", desc: "Band at elbow, critical for overhead throwing." },
      { name: "Serratus Activation", sets: 3, reps: 12, area: "Shoulder Blade", desc: "Serratus push-up plus at top of movement." },
      { name: "Wrist Strengthening", sets: 3, reps: 15, area: "Wrists", desc: "Wrist curls and extensions for ball control." },
    ]},
  ]},
  triathlon: { name: "Triathlon", emoji: "🏊", plans: [
    { name: "Transition Body Care", type: "prehab", duration: 15, exercises: [
      { name: "Hip Flexor Stretch", sets: 3, duration: 45, area: "Hips", desc: "Addresses both cycling and running hip flexor stress." },
      { name: "Calf Eccentric", sets: 4, reps: 15, area: "Calves", desc: "Running after cycling loads calves differently." },
      { name: "Shoulder Mobility", sets: 2, duration: 40, area: "Shoulders", desc: "Maintain range after swimming volume." },
      { name: "IT Band Roll", sets: 1, duration: 60, area: "IT Band", desc: "Cycling accumulates IT band tension before running." },
    ]},
    { name: "Run-Off-Bike Legs", type: "warmup", duration: 10, exercises: [
      { name: "Leg Swings", sets: 2, reps: 15, area: "Hips", desc: "Reactivate hip flexors after cycling position." },
      { name: "Glute Activation", sets: 2, reps: 15, area: "Glutes", desc: "Glutes inhibit during cycling — reawaken for running." },
      { name: "Ankle Bounces", sets: 2, duration: 20, area: "Calves", desc: "Wake up plantar flexors for running gait." },
    ]},
  ]},
};

const TYPE_BADGE = { prehab: "default", warmup: "emerald", cooldown: "secondary", mobility: "default", rehab: "amber", recovery: "secondary" };
const ALL_SPORTS = Object.keys(PLANS_DATA);

export default function SportPlans() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [search, setSearch] = useState("");
  const sportData = selected ? PLANS_DATA[selected] : null;

  const filteredSports = ALL_SPORTS.filter(s =>
    !search || PLANS_DATA[s].name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[var(--bg)] sticky top-16 z-10 border-b border-[var(--border)]/30 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          {selected && (
            <button onClick={() => { setSelected(null); setExpandedPlan(null); }}
              className="w-9 h-9 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--text)]/40 hover:text-[var(--text)] transition-all flex-shrink-0">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="font-display text-2xl text-[var(--text)]">
              {selected ? sportData?.name + " Plans" : "Sport Plans"}
            </h1>
            <p className="kaya-label">
              {selected ? `${sportData?.plans.length} programmes` : `${ALL_SPORTS.length} sports`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text)]/20" />
                <Input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search sport..." className="pl-10 bg-[var(--card)] border-[var(--border)] text-[var(--text)]" />
                {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)]/30 hover:text-[#1B7A4A]"><X className="w-4 h-4" /></button>}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredSports.map((sport, i) => (
                  <motion.button key={sport} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    onClick={() => setSelected(sport)}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-left hover:border-[#1B7A4A]/30 hover:bg-[var(--card-hover)] transition-all group">
                    <span className="text-2xl mb-3 block">{PLANS_DATA[sport].emoji}</span>
                    <h3 className="font-display text-base text-[var(--text)] group-hover:text-[#1B7A4A] transition-colors">{PLANS_DATA[sport].name}</h3>
                    <p className="kaya-label mt-1">{PLANS_DATA[sport].plans.length} {PLANS_DATA[sport].plans.length === 1 ? "programme" : "programmes"}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="plans" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {sportData?.plans.map((plan, i) => (
                <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[#1B7A4A]/20 transition-all">
                  <div className="p-5 flex items-start justify-between cursor-pointer"
                    onClick={() => setExpandedPlan(expandedPlan === plan.name ? null : plan.name)}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={TYPE_BADGE[plan.type] || "default"} className="capitalize">{plan.type}</Badge>
                        <span className="text-[#1B7A4A]/50 text-xs font-mono flex items-center gap-1"><Clock className="w-3 h-3" />{plan.duration}m</span>
                        <span className="text-[var(--text)]/20 text-xs font-mono flex items-center gap-1"><Dumbbell className="w-3 h-3" />{plan.exercises.length}</span>
                      </div>
                      <h3 className="font-display text-xl text-[var(--text)]">{plan.name}</h3>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-[var(--border)] transition-transform flex-shrink-0 mt-1 ${expandedPlan === plan.name ? "rotate-90 text-[#1B7A4A]" : ""}`} />
                  </div>
                  <AnimatePresence>
                    {expandedPlan === plan.name && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-[var(--border)]/50">
                        <div className="p-5 space-y-3">
                          {plan.exercises.map((ex, j) => (
                            <div key={j} className="flex items-start gap-3 bg-[var(--surface)] rounded-xl p-4 border border-[var(--border)]/50">
                              <div className="w-7 h-7 bg-[#1B7A4A]/10 border border-[#1B7A4A]/20 rounded-lg flex items-center justify-center text-xs font-mono text-[#1B7A4A] flex-shrink-0 mt-0.5">{j + 1}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <p className="font-body font-semibold text-[var(--text)] text-sm">{ex.name}</p>
                                  <span className="text-xs font-mono text-[#1B7A4A]/50 flex-shrink-0">
                                    {ex.duration ? `${ex.duration}s` : ex.reps ? `${ex.sets}×${ex.reps}` : ""}
                                  </span>
                                </div>
                                <p className="text-[#1B7A4A]/40 text-[9px] font-body uppercase tracking-widest mb-1">{ex.area}</p>
                                {ex.desc && <p className="text-[var(--text)]/30 text-xs font-body leading-relaxed">{ex.desc}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
