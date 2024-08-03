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
    const texture = new THREE.TextureLoader().load(
      "./assets/mertdogan12-skin.png"
    );
    texture.magFilter = THREE.NearestFilter;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: 0xeb4034,
    });

    // Arms
    const armBox = new THREE.BoxGeometry(4, 12, 4);

    const armLeftMesh = new THREE.Mesh(armBox, material2);
    this._armLeft.add(armLeftMesh);

    this._armLeft.position.set(4, 2, 0);
    armLeftMesh.position.set(2, -2, 0);

    const armRightMesh = new THREE.Mesh(armBox, material2);
    this._armRight.add(armRightMesh);

    this._armRight.position.set(-4, 2, 0);
    armRightMesh.position.set(-2, -2, 0);

    // Body
    const bodyBox = new THREE.BoxGeometry(8, 12, 4.1);
    this._body = new THREE.Mesh(bodyBox, material2);
    this._body.position.set(0, 0, 0);

    // Head
    const headBox = new THREE.BoxGeometry(8, 8, 8);
    const headMesh = new THREE.Mesh(headBox, material);
    const uvData = headBox.attributes.uv as THREE.BufferAttribute;

    const avData = [];
    avData.push(...this.createUVData(2 * 8, 8));
    avData.push(...this.createUVData(0, 8));
    avData.push(...this.createUVData(3 * 8, 8));
    avData.push(...this.createUVData(8, 0));
    avData.push(...this.createUVData(8, 8));
    avData.push(...this.createUVData(2 * 8, 0));

    uvData.set(new Float32Array(avData));
    uvData.needsUpdate = true;

    console.log(uvData);

    this._head.add(headMesh);
    this._head.position.set(0, 6, 0);
    headMesh.position.set(0, 4, 0);

    // Legs
    this._legLeft = new THREE.Mesh(armBox, material2);
    this._legLeft.position.set(2, -12, 0);

    this._legRight = new THREE.Mesh(armBox, material2);
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

  private createUVData(u: number, v: number): number[] {
    return [
      u / 64,
      1 - v / 64,
      (u + 8) / 64,
      1 - v / 64,
      u / 64,
      1 - (v + 8) / 64,
      (u + 8) / 64,
      1 - (v + 8) / 64,
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
