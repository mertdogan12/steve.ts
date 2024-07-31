import * as THREE from "three";

class Steve {
  private _steve: THREE.Group;
  private _armLeft: THREE.Group;
  private _armRight: THREE.Group;
  private _body: THREE.Mesh;
  private _head: THREE.Mesh;
  private _legLeft: THREE.Mesh;
  private _legRight: THREE.Mesh;
  private _rotatonX: number;

  constructor() {
    this._rotatonX = 1;
    this._armLeft = new THREE.Group();
    this._armRight = new THREE.Group();
    this._steve = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x00fff0,
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
    this._body = new THREE.Mesh(bodyBox, material);
    this._body.position.set(0, 0, 0);

    // Head
    const headBox = new THREE.BoxGeometry(8, 8, 8);
    this._head = new THREE.Mesh(headBox, material2);
    this._head.position.set(0, 10, 0);

    // Legs
    this._legLeft = new THREE.Mesh(armBox, material);
    this._legLeft.position.set(2, -12, 0);

    this._legRight = new THREE.Mesh(armBox, material);
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

  private calcArmRotation(x: number) {
    return Math.cos(x * 0.09) * 0.05 + 0.05;
  }

  public get steve() {
    return this._steve;
  }

  public animate() {
    this._rotatonX += 0.1;

    this._armLeft.rotation.z = this.calcArmRotation(this._rotatonX);
    this._armRight.rotation.z = -this.calcArmRotation(this._rotatonX);
  }
}

export { Steve };
