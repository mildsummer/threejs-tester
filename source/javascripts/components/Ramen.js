class Ramen {
  constructor(url, scene) {
    new THREE.TextureLoader().load(url, (texture) => {
      this._setTexture(texture, scene);
    });
    var geometry = new THREE.PlaneGeometry(10,10);
    var material = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh(geometry, material);
    scene.add(this.mesh);
  }

  _setTexture(texture) {
    this.mesh.material.map = texture;
    this.mesh.material.needsUpdate = true;
    return this;
  }

  setPosition(x, y) {
    this.position = { x: x, y: y };
    this.mesh.position.set(x, y, 0);
    return this;
  }

  setScale(scale) {
    this.mesh.scale.set(scale, scale, scale);
    return this;
  }

  startMotion(startAngle, radius, deltaAngle) {
    this.angle = startAngle;
    this.radius = radius;
    this.deltaAngle = deltaAngle;
    this._move();
    return this;
  }

  _move() {
    this.angle += this.deltaAngle;
    this.mesh.position.set(this.position.x + this.radius * Math.cos(this.angle), this.position.y + this.radius * Math.sin(this.angle), 0);
    requestAnimationFrame(this._move.bind(this));
  }

}

export default Ramen;