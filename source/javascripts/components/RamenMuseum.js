import Ramen from './Ramen';

class RamenMuseum {
  constructor(wrapperSelector, ramenNum) {

    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();
    this.wrapper = document.querySelector(wrapperSelector);
    this.wrapper.appendChild(this.renderer.domElement);
    this.renderer.setSize(this.wrapper.clientWidth, this.wrapper.clientHeight);
    this.camera = new THREE.PerspectiveCamera(75, this.wrapper.clientWidth / this.wrapper.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.ramens = [];
    this.ramenURLs = [
      './images/01.jpg',
      './images/02.jpg',
      './images/03.jpg',
      './images/04.jpg',
      './images/05.jpg',
      './images/06.jpg',
      './images/07.jpg',
      './images/08.jpg',
      './images/09.jpg',
      './images/10.jpg',
      './images/11.gif',
      './images/12.png'
    ];
    for (var i = 1; i <= ramenNum; i++) {
      this._addRamen();
    }

    this.stats = new Stats();
    this.stats.setMode(0); // 0: fps, 1: ms, 2: mb

    // align top-left
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';

    this.wrapper.appendChild(this.stats.domElement);

    this._render();
    return this;
  }

  _render() {
    this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.stats.end();
    requestAnimationFrame(this._render.bind(this));
  }

  setRamenNum(ramenNum) {
    if (ramenNum > this.ramens.length) {
      this._addRamen().setRamenNum(ramenNum);
    } else if (ramenNum < this.ramens.length) {
      this._removeRamen().setRamenNum(ramenNum);
    }
  }

  _addRamen() {
    let ramenURL = this.ramenURLs[Math.floor(this.ramenURLs.length * Math.random())];
    let ramen = new Ramen(ramenURL, this.scene);
    ramen.setPosition(Math.random() * 8 - 4, Math.random() * 8 - 4).setScale(0.1).startMotion(1 * Math.random(), 1 * Math.random(), 0.5 * Math.random());
    this.ramens.push(ramen);
    return this;
  }

  _removeRamen() {
    let ramen = this.ramens[this.ramens.length - 1];
    this.scene.remove(ramen.mesh);
    ramen.mesh.geometry.dispose();
    ramen.mesh.material.map.dispose();
    ramen.mesh.material.dispose();
    this.ramens.pop();
    return this;
  }

  handleResize() {
    this.renderer.setSize(this.wrapper.clientWidth, this.wrapper.clientHeight);
    this.camera.aspect = this.wrapper.clientWidth / this.wrapper.clientHeight;
    this.camera.updateProjectionMatrix();
    return this;
  }
}

export default RamenMuseum;