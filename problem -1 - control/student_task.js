/* 
 * Aqua Software Recruitment Task
 * 
 * Your Goal: Implement the control logic for the ROV.
 * 
 * CONTROL LOGIC EXPLAINED:
 * 1. The ROV has two thrusters: Left and Right.
 *    - Use `leftMotorDriver(speed)` and `rightMotorDriver(speed)` to control them.
 *    - speed range: -1023 (Reverse) to 1023 (Forward).
 * 
 * 2. Depth is controlled by a Ballast Tank.
 *    - Use `injectorPump(speed)` to add water
 *    - Use `ejectorPump(speed)` to remove water
 *    - speed range: 0 to 1023.
 * 
 * GLOBAL VARIABLES:
 * - joystickLeft (Object): { x, y } - range -1024 to 1024
 * - joystickRight (Object): { x, y } - range -1024 to 1024
 */


/* 
 * TASK 1: BUTTON CONTROLS
 * Implement these functions to control the hardware.
 * Use valid values (e.g. 1023, 0, -1023) for the drivers.
 */

function moveForward() {
    leftMotorDriver(500);
    rightMotorDriver(500);
}

function moveBackward() {
    leftMotorDriver(-500);
    rightMotorDriver(-500);
}

function turnLeft() {
    leftMotorDriver(-500);
    rightMotorDriver(500);
}

function turnRight() {
    leftMotorDriver(500);
    rightMotorDriver(-500);
}

function ascend() {
    injectorPump(0);   // FORCE stop intake
    ejectorPump(500);  // Expel water
}

function descend() {
    ejectorPump(0);    // FORCE stop expel
    injectorPump(500); // Take in water
}




/* 
 * TASK 2: JOYSTICK CONTROL
 * This function is called every frame when in Joystick Mode.
 * 
 * INPUTS:
 *  - joystickLeft.y: Forward/Backward (-1024 to 1024). Up is Positive (Forward).
 *  - joystickLeft.x: Turn Left/Right (-1024 to 1024).
 *  - joystickRight.y: Depth Control (-1024 to 1024).
 * 
 * TASK:
 *  - Calculate appropriate motor values based on joystick inputs.
 *  - Map outputs to -1023 to 1023.
 */
// TASK 2: JOYSTICK CONTROL
function handleJoystickControl() {
    // ----- PART 1: MOVEMENT (Left Joystick) -----
    // joystickLeft.y: Forward/Backward (-1024 to 1024)
    // joystickLeft.x: Left/Right Turn (-1024 to 1024)
    
    // Tank drive mixing formula:
    // leftMotor = forward + turn
    // rightMotor = forward - turn
    let leftMotorSpeed = joystickLeft.y + joystickLeft.x;
    let rightMotorSpeed = joystickLeft.y - joystickLeft.x;
    
    // Clamp values to valid range (-1024 to 1024)
    leftMotorSpeed = Math.max(-1024, Math.min(1024, leftMotorSpeed));
    rightMotorSpeed = Math.max(-1024, Math.min(1024, rightMotorSpeed));
    
    // Apply to motors
    leftMotorDriver(leftMotorSpeed);
    rightMotorDriver(rightMotorSpeed);
    
    // ----- PART 2: DEPTH (Right Joystick) -----
    // joystickRight.y: Up/Down (-1024 to 1024)
    // Positive = Down (descend), Negative = Up (ascend)
    
    // Add deadzone to ignore tiny movements
    const deadzone = 50;
    
    if (joystickRight.y > deadzone) {
        // DOWN: Add water to sink
        injectorPump(joystickRight.y);
        ejectorPump(0); // Stop the other pump
    } else if (joystickRight.y < -deadzone) {
        // UP: Remove water to rise
        ejectorPump(-joystickRight.y); // Convert negative to positive
        injectorPump(0); // Stop the other pump
    } else {
        // NEUTRAL: Stop both pumps
        injectorPump(0);
        ejectorPump(0);
    }
}







// --- EVENT LISTENERS (DO NOT REMOVE) ---
function stop() {
    leftMotorDriver(0);
    rightMotorDriver(0);
    injectorPump(0);
    ejectorPump(0);
}

if (document.getElementById('btn-forward')) {
    const attachButton = (id, startHandler) => {
        const btn = document.getElementById(id);
        if(!btn) return;
        btn.addEventListener('mousedown', startHandler);
        btn.addEventListener('mouseup', stop);
        btn.addEventListener('mouseleave', stop);
    };

    attachButton('btn-forward', moveForward);
    attachButton('btn-backward', moveBackward);
    attachButton('btn-left', turnLeft);
    attachButton('btn-right', turnRight);
    attachButton('btn-ascend', ascend);
    attachButton('btn-descend', descend);
}

