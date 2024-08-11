import * as THREE from "three";

class Steve {
  private _rotatonX: number = 1;
  private _steve: THREE.Group = new THREE.Group();
  private _armLeft: THREE.Group = new THREE.Group();
  private _armRight: THREE.Group = new THREE.Group();
  private _head: THREE.Group = new THREE.Group();

  private _body: THREE.Mesh;
  private _legLeft: THREE.Mesh;
  private _legRight: THREE.Mesh;

  constructor() {
    const texture = new THREE.TextureLoader().load("./assets/example.png");
    texture.magFilter = THREE.NearestFilter;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });

    // Arms
    const armLeftBox = new THREE.BoxGeometry(4, 12, 4);
    this.createUVData(armLeftBox, 36, 52, 4, 12, 4);

    const armRightBox = new THREE.BoxGeometry(4, 12, 4);
    this.createUVData(armRightBox, 44, 20, 4, 12, 4);

    const armLeftMesh = new THREE.Mesh(armLeftBox, material);
    this._armLeft.add(armLeftMesh);

    this._armLeft.position.set(4, 2, 0);
    armLeftMesh.position.set(2, -2, 0);

    const armRightMesh = new THREE.Mesh(armRightBox, material);
    this._armRight.add(armRightMesh);

    this._armRight.position.set(-4, 2, 0);
    armRightMesh.position.set(-2, -2, 0);

    // Body
    const bodyBox = new THREE.BoxGeometry(8, 12, 4.1);
    this.createUVData(bodyBox, 20, 20, 8, 12, 4);

    this._body = new THREE.Mesh(bodyBox, material);
    this._body.position.set(0, 0, 0);

    // Head
    const headBox = new THREE.BoxGeometry(8, 8, 8);
    const headMesh = new THREE.Mesh(headBox, material);

    this.createUVData(headBox, 8, 8, 8, 8, 8);

    this._head.add(headMesh);
    this._head.position.set(0, 6, 0);
    headMesh.position.set(0, 4, 0);

    // Legs
    const legLeftBox = new THREE.BoxGeometry(4, 12, 4);
    this.createUVData(legLeftBox, 20, 52, 4, 12, 4);

    const legRightBox = new THREE.BoxGeometry(4, 12, 4);
    this.createUVData(legRightBox, 4, 20, 4, 12, 4);

    this._legLeft = new THREE.Mesh(legLeftBox, material);
    this._legLeft.position.set(2, -12, 0);

    this._legRight = new THREE.Mesh(legRightBox, material);
    this._legRight.position.set(-2, -12, 0);

    this.steve.add(
      this._armLeft,
      this._armRight,
      this._body,
      this._head,
      this._legLeft,
      this._legRight
    );
  }

  private createUVData(
    box: THREE.BoxGeometry,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number
  ) {
    const uvData = [
      ...this.createUVDataSide(width + x, y, depth, height), // Left
      ...this.createUVDataSide(x - depth, y, depth, height), // Right
      ...this.createUVDataSide(x, y - depth, width, depth), // Top
      ...this.createUVDataSide(x + width, y - depth, width, depth), // Bottom
      ...this.createUVDataSide(x, y, width, height), // Front
      ...this.createUVDataSide(depth + width + x, y, width, height), // Back
    ];

    const uvAttribute = box.attributes.uv as THREE.BufferAttribute;
    uvAttribute.set(new Float32Array(uvData));
    uvAttribute.needsUpdate = true;
  }

  private createUVDataSide(
    u: number,
    v: number,
    width: number,
    height: number
  ): number[] {
    return [
      u / 64,
      1 - v / 64,
      (u + width) / 64,
      1 - v / 64,
      u / 64,
      1 - (v + height) / 64,
      (u + width) / 64,
      1 - (v + height) / 64,
    ];
  }

  private calcArmRotation(rotation: number): [z: number, x: number] {
    const z = Math.cos(rotation * 0.09) * 0.05 + 0.05;
    const x = Math.sin(rotation * 0.067) * 0.05;

    return [z, x];
  }

  private calcMouse(mouse: THREE.Vector2): [yaw: number, pitch: number] {
    const yaw = (mouse.x / window.innerWidth) * 2 - 1;
    const pitch = -(mouse.y / window.innerHeight) * 2 + 1;

    return [yaw, -pitch];
  }

  public get steve() {
    return this._steve;
  }

  public lookAtMouse(mouse: THREE.Vector2) {
    const [yaw, pitch] = this.calcMouse(mouse);

    this._head.rotation.y = yaw;
    this._head.rotation.x = pitch;

    this.steve.rotation.y = Math.atan(yaw / 40) * 40;
    this.steve.rotation.x = Math.atan(pitch / 40) * 20;
  }

  public animateArms() {
    this._rotatonX += 0.1;

    const [z, x] = this.calcArmRotation(this._rotatonX);

    this._armLeft.rotation.z = z;
    this._armRight.rotation.z = -z;
    this._armLeft.rotation.x = x;
    this._armRight.rotation.x = -x;
  }
}

export { Steve };
