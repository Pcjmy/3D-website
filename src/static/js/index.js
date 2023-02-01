import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

// const gui = new dat.GUI()

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth/window.innerHeight,
  0.1,
  30
)

const textureLoader = new THREE.TextureLoader()
// 设置相机位置
camera.position.set(0, 0, 20)
scene.add(camera)

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

let cubeGroup = new THREE.Group();
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let z = 0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(2*i-5, 2*j-5, 2*z-5);
      cubeGroup.add(cube);
    }
  }
}

scene.add(cubeGroup);

let triangleMesh;
// 创建几何体
for (let i=0; i<50; i++) {
  // 每一个三角形，需要三个顶点，每个顶点需要三个值
  const geometry = new THREE.BufferGeometry()
  const positionArray = new Float32Array(9)
  for (let j=0; j<9; j++) {
    if (j%3 === 1) {
      positionArray[j] = Math.random() * 10 - 30
    } else {
      positionArray[j] = Math.random() * 10 - 5
    }
  }
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionArray, 3)
  )
  let color = new THREE.Color(Math.random(), Math.random(), Math.random())
  const Material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.5 })
  // 根据几何体和材质创建物体
  const mesh = new THREE.Mesh(geometry, Material)
  // 将几何体添加到场景中
  scene.add(mesh)
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster();

// 鼠标的位置对象
const mouse = new THREE.Vector2();

// 初始化渲染器
// 渲染器透明
const renderer = new THREE.WebGLRenderer({alpha: true});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;

// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 设置时钟
const clock = new THREE.Clock();

function render() {
  let time = clock.getElapsedTime();
  cubeGroup.rotation.x = time * 0.5;
  cubeGroup.rotation.y = time * 0.5;
  renderer.render(scene, camera)
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render)
}

render()

// 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新摄像头的投影矩阵
  camera.updateProjectionMatrix()
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio)
})