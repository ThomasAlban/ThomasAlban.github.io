const scene = new THREE.Scene();
const raycaster = new THREE.Raycaster();                        // will be used to see if mouse is over objects in 3d scene
const container = document.getElementById('cocktailselect');    // the whole section within which the canvas resides
const canvas = document.getElementById("bg");                   // the canvas within which we display the 3d scene

const pointer = new THREE.Vector2();                            // variable which will store mouse pos
let pointerDown = false;                                        // variable which will store whether mouse is clicked


const camera = new THREE.PerspectiveCamera(                     // the camera (the view point from which we will see stuff)
/* FOV */ 75,
/* Aspect Ratio */ $(container).width()/$(container).height(),
/* Near Clipping Plane */ 0.1,
/* Far Clipping Plane */ 1000 
);

const renderer = new THREE.WebGLRenderer({                      // make the renderer and make it inside the canvas with an id of #bg
    canvas: document.querySelector('#bg'),
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize($(container).width(), $(container).height());  // set the renderer size to the width and height of the container
container.appendChild(renderer.domElement);


const imageWidth = 10; const imageHeight = 21;                  // width and height of all the cocktail images
// add martini image
const martiniMap = new THREE.TextureLoader().load("cocktail images/martini.png");
const martiniMaterial = new THREE.SpriteMaterial ( {map: martiniMap, color: 0xffffff} );
const martiniSprite = new THREE.Sprite(martiniMaterial);
martiniSprite.scale.set(imageWidth, imageHeight, 1);
martiniSprite.position.z = 30;
martiniSprite.name = "Martini";
scene.add(martiniSprite);
// add tequila sunrise image
const tequilaSunriseMap = new THREE.TextureLoader().load("cocktail images/tequila sunrise.png");
const tequilaSunriseMaterial = new THREE.SpriteMaterial ( {map: tequilaSunriseMap, color: 0xffffff} );
const tequilaSunriseSprite = new THREE.Sprite(tequilaSunriseMaterial);
tequilaSunriseSprite.scale.set(imageWidth, imageHeight, 1);
tequilaSunriseSprite.position.x = 30;
tequilaSunriseSprite.name = "Tequila Sunrise";
scene.add(tequilaSunriseSprite);
// add cosmopolitan image
const cosmopolitanMap = new THREE.TextureLoader().load("cocktail images/cosmopolitan.png");
const cosmopolitanMaterial = new THREE.SpriteMaterial ( {map: cosmopolitanMap, color: 0xffffff} );
const cosmopolitanSprite = new THREE.Sprite(cosmopolitanMaterial);
cosmopolitanSprite.scale.set(imageWidth, imageHeight, 1);
cosmopolitanSprite.position.x = -30;
cosmopolitanSprite.name = "Cosmopolitan";
scene.add(cosmopolitanSprite);
// add negroni image
const negroniMap = new THREE.TextureLoader().load("cocktail images/negroni.png");
const negroniMaterial = new THREE.SpriteMaterial ( {map: negroniMap, color: 0xffffff} );
const negroniSprite = new THREE.Sprite(negroniMaterial);
negroniSprite.scale.set(imageWidth, imageHeight, 1);
negroniSprite.position.z = -30;
negroniSprite.name = "Negroni";
scene.add(negroniSprite);

// yes, I could have made all the cocktail sprites inside a function then just called it 4 times, but do I look like I care?

//add stars
function addStar() {                                                    // function that allows us to add stars in random positions
    const geometry = new THREE.SphereGeometry(0.2);                     // make a sphere with radius 0.2
    const material = new THREE.MeshBasicMaterial( {color:0xffffff} )    // make the material be white
    const star = new THREE.Mesh (geometry, material);                   // make the star which puts the sphere together with the white material
    const [x,y,z] = Array(3).fill().map(() => 
        THREE.MathUtils.randFloatSpread(400)                            // randomise the star position between -400 and 400
    );
    star.position.set(x,y,z);                                           // set the star position to the randomised x, y, and z values
    scene.add(star);                                                    // add the star to the scene
}
Array(200).fill().forEach(addStar);                                     // add 200 stars to the scene by calling the above function 200 times


// load the skybox into the background
scene.background = new THREE.CubeTextureLoader().load( ['left.png','right.png','top.png','bottom.png','back.png','front.png'] );


let countUp = 0;                    // variable that will count upwards which will be used to make the camera orbit the centre
let countUpVelocity = 0;
let objectBeingHoveredOver = 0;     // variable that will store the current object being hovered over
camera.position.y = 5;
let scrollToSelectedCocktail = false;
const cocktailNameText = document.querySelector('#cocktailname');
let cocktailNameTextOpacity = 0;
const cocktailInstructionText = document.querySelector('.cocktailinstruction'); // so that we can access the CSS from the cocktail instruction text, we will use this to change its opacity
let cocktailInstructionTextOpacity = 0;
let countUpForCocktailInstructionText = 0;
let cocktailInstructionFlashing = false;


window.onload = () => { requestAnimationFrame(animate) };   // kick off the animation loop (the 'animate' function)

function animate() {
    requestAnimationFrame(animate);

    countUp += countUpVelocity;

    if (!scrollToSelectedCocktail) {countUpVelocity = 0.004}// continuously revolve the camera around unless we are scrolling to selected cocktail

    if (countUp >= (9/4 * Math.PI)) {countUp = Math.PI/4}   // once countUp has done a full circle, set it to the same amount round the circle but one behind (we are working in radians)


    cocktailInstructionText.style.opacity = cocktailInstructionTextOpacity;
    cocktailNameText.style.opacity = cocktailNameTextOpacity;



    camera.position.z = Math.sin(countUp)*50,               // make the camera go round in the z coordinate
    camera.position.x = Math.cos(countUp)*50;               // make the camera go round in the x coordinate
    camera.lookAt(0,0,0);


    raycaster.setFromCamera(pointer, camera);               // send out a ray from the mouse position
    const objects = [martiniSprite, tequilaSunriseSprite, cosmopolitanSprite, negroniSprite]; // make an array containing all the objects we want the mouse to interact with
    let intersects = raycaster.intersectObjects(objects);   // see if this ray we have sent out intersects with any object


    if (intersects.length > 0 && !scrollToSelectedCocktail){// if the ray does intersect

        objectBeingHoveredOver = intersects[0].object;      // create a variable of the object that the mouse is over

        if (objectBeingHoveredOver.scale.x < 11) {          // enlarge the object (when the mouse is over it)
            objectBeingHoveredOver.scale.x +=0.125;         // increase the x and y values so that the image proportions remain the same
            objectBeingHoveredOver.scale.y +=0.2625;
        }

        if (pointerDown) {scrollToSelectedCocktail = true}  // if we are hovering over an object and have clicked the mouse, set the variable that controls scrolling to the cocktail to true

    }
    if (intersects.length == 0){// if the ray does not intersect

        for (let i = 0; i < objects.length; i++) {          // run through all the different cocktail images
            if (objects[i].scale.x > 10) {                  // scale all the cocktail images down until they are the right size
                objects[i].scale.x -=0.125;
                objects[i].scale.y -=0.2625;
            }
        }
    }

    if (scrollToSelectedCocktail) {
        goRoundUntilReachCocktail(objectBeingHoveredOver, "Tequila Sunrise", Math.PI*2);            // calls the function below, plugging in the string name of the sprite we want, and it's angle around the circle in radians
        goRoundUntilReachCocktail(objectBeingHoveredOver, "Martini", Math.PI/2);
        goRoundUntilReachCocktail(objectBeingHoveredOver, "Cosmopolitan", Math.PI);
        goRoundUntilReachCocktail(objectBeingHoveredOver, "Negroni", Math.PI*1.5);

        if (cocktailNameTextOpacity<1) {cocktailNameTextOpacity += 0.01}                            // fade the name of the cocktail in 
        if (cocktailInstructionTextOpacity<0.6) {cocktailInstructionTextOpacity += 0.01}            // fade the thingy telling you to click on the cocktail in 
        if (cocktailInstructionTextOpacity>=0.6) {cocktailInstructionFlashing = true}
        if (cocktailInstructionFlashing) {
            countUpForCocktailInstructionText+=0.05;
            cocktailInstructionTextOpacity = Math.sin(countUpForCocktailInstructionText)/4 + 0.5;   // make the thingy telling you to click on the cocktail increase and decrease in opacity
        }

        if (intersects.length > 0 && intersects[0].object === objectBeingHoveredOver) {
            if (intersects[0].object.scale.x < 11) {          // enlarge the object (when the mouse is over it)
                intersects[0].object.scale.x +=0.125;         // increase the x and y values so that the image proportions remain the same
                intersects[0].object.scale.y +=0.2625;
            }   

            if (objectBeingHoveredOver.name === "Tequila Sunrise" && pointerDown && cocktailNameTextOpacity >= 1) {window.location.href = "https://thomasalban.com/Cocktail-Roulette/Tequila Sunrise/"}
            if (objectBeingHoveredOver.name === "Martini" && pointerDown && cocktailNameTextOpacity >= 1) {window.location.href = "https://thomasalban.com/Cocktail-Roulette/Martini/"}
            if (objectBeingHoveredOver.name === "Cosmopolitan" && pointerDown && cocktailNameTextOpacity >= 1) {window.location.href = "https://thomasalban.com/Cocktail-Roulette/Cosmopolitan/"}
            if (objectBeingHoveredOver.name === "Negroni" && pointerDown && cocktailNameTextOpacity >= 1) {window.location.href = "https://thomasalban.com/Cocktail-Roulette/Negroni/"}

        }


    }
    
    renderer.render(scene, camera);                         // actually render the scene
}

function goRoundUntilReachCocktail(obj, name, distanceAroundCameraPIStuff) {
    if (obj.name === name) {        // if the name of the object we are hovering over matches the object this function has been called for
        document.getElementById("cocktailname").innerHTML = name; // NOT FINISHED
        if (! (countUp > (distanceAroundCameraPIStuff - 0.002)  && countUp < (distanceAroundCameraPIStuff + 0.002) ) ) {            // if we are NOT really close to the object
            countUpVelocity = 0.0025;           // make the camera revolve around really slowly
            if (! (countUp > (distanceAroundCameraPIStuff - 0.05)  && countUp < (distanceAroundCameraPIStuff + 0.05) ) ) {          // if we are NOT a little bit further away
                countUpVelocity = 0.01;         // make the camera revolve around even slower, overwriting the previous velocity value
                if (! (countUp > (distanceAroundCameraPIStuff - 0.1)  && countUp < (distanceAroundCameraPIStuff + 0.1) ) ) {        // if we are NOT even further away than that
                    countUpVelocity = 0.025;    // make the camera revolve around a bit slower, overwriting the previous velocity value
                    if (! (countUp > (distanceAroundCameraPIStuff - 0.3)  && countUp < (distanceAroundCameraPIStuff + 0.3) ) ) {    // if we are NOT even further away than before
                        countUpVelocity = 0.1;  // make the camera revolve around fast (because we're far away), overwriting the previous velocity value
                    }
                }
            }
        }
        else {countUpVelocity = 0}              // make the camera stop (because if we've got to this point, we know that we are really close to the object - we're never going to get an exact value for Math.PI)
    }
}


window.addEventListener('resize', () => {                               // when window is resized, resize canvas

    camera.aspect = $(container).width()/$(container).height();         // make the camera aspect ratio be correct (the container width divided by the container height will give a good value)
    camera.updateProjectionMatrix();
    renderer.setSize($(container).width(), $(container).height());      // set the renderer size to the container width and height (which will make it correct because we've just resized the window)

});

window.addEventListener('pointermove', (event) => {                     // set the pointer variable so we know where the mouse is if it moves
    pointer.x = (event.pageX / $(container).width()) * 2 - 1;           //location of cursor in relation to page, divided by width of container (so it's now a value btw 0 and 1); then * 2 and - 1 so that it's a value btw -1 and 1
    pointer.y = ((event.pageY / $(container).height()) - 1) * 2 - 1;    // same thing as above, except we take 1 away from the mouse y pos divided by the container height, because the canvas we are working with is one whole screen length down the screen
});

window.addEventListener('pointerdown', () => {pointerDown = true});     // set the pointerDown variable so we know if the mouse is clicked
window.addEventListener('pointerup', () => {pointerDown = false});

