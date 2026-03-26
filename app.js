const canvas = document.querySelector("#webgl")

const scene = new THREE.Scene()



const camera = new THREE.PerspectiveCamera(
45,
canvas.clientWidth / canvas.clientHeight,
0.1,
100
)

camera.position.set(0,0,5)



const renderer = new THREE.WebGLRenderer({
canvas:canvas,
alpha:true,
antialias:true
})

renderer.setSize(canvas.clientWidth,canvas.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))

renderer.outputEncoding = THREE.sRGBEncoding

/* NUEVO — iluminación física */

renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.6



/* HDR ENVIRONMENT LIGHTING */

const pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader()

new THREE.RGBELoader()
.load("textures/studio.hdr", function(texture){

const envMap = pmremGenerator.fromEquirectangular(texture).texture

scene.environment = envMap

})



/* LIGHTING */

const keyLight = new THREE.DirectionalLight(0xffffff,3)
keyLight.position.set(3,3,3)
scene.add(keyLight)

const fillLight = new THREE.DirectionalLight(0xffffff,2)
fillLight.position.set(-3,1,-2)
scene.add(fillLight)

const ambient = new THREE.AmbientLight(0xffffff,1.5)
scene.add(ambient)

const topLight = new THREE.DirectionalLight(0xffffff,2)
topLight.position.set(0,5,0)
scene.add(topLight)



/* CONTROLS */

const controls = new THREE.OrbitControls(camera,renderer.domElement)

controls.enablePan=false
controls.enableZoom=false

controls.enableDamping=true
controls.dampingFactor=0.08



/* MODEL */

let model

const loader = new THREE.GLTFLoader()

loader.load(

"models/product.glb",

function(gltf){

model = gltf.scene

model.scale.set(0.8,0.8,0.8)



/* AJUSTE MATERIAL METÁLICO */

model.traverse((child)=>{

if(child.isMesh){

child.material.metalness = 1
child.material.roughness = 0.2

}

})



scene.add(model)

document.getElementById("loader").style.display="none"

animate()

},

undefined,

function(error){

console.error(error)

}

)



/* RENDER */

function animate(){

requestAnimationFrame(animate)

controls.update()

renderer.render(scene,camera)

}



/* RESPONSIVE */

window.addEventListener("resize",()=>{

const width = canvas.clientWidth
const height = canvas.clientHeight

camera.aspect = width/height
camera.updateProjectionMatrix()

renderer.setSize(width,height)

})



