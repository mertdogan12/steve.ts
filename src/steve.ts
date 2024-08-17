import * as THREE from "three";

class Steve {
  private _rotatonX: number = 1;
  private _steve: THREE.Group = new THREE.Group();
  private _armLeft: THREE.Group = new THREE.Group();
  private _armRight: THREE.Group = new THREE.Group();
  private _head: THREE.Group = new THREE.Group();
  private _body: THREE.Group = new THREE.Group();
  private _legLeft: THREE.Group = new THREE.Group();
  private _legRight: THREE.Group = new THREE.Group();

  constructor(texture_path?: string) {
    if (texture_path === undefined) {
      texture_path = "./assets/example.png";
    }

    const texture = new THREE.TextureLoader().load(texture_path);

    texture.magFilter = THREE.NearestFilter;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
    });
    const secondLayerMaterial = new THREE.MeshStandardMaterial({
      map: texture,
    });
    secondLayerMaterial.transparent = true;

    // Arms
    this._armLeft.add(this.createBox(2, -2, 0, 4, 12, 4, 36, 52, material));
    this._armLeft.add(
      this.createBox(2, -2, 0, 4, 12, 4, 52, 52, secondLayerMaterial, 0.5)
    );
    this._armLeft.position.set(4, 2, 0);

    this._armRight.add(this.createBox(-2, -2, 0, 4, 12, 4, 44, 20, material));
    this._armRight.add(
      this.createBox(-2, -2, 0, 4, 12, 4, 44, 36, secondLayerMaterial, 0.5)
    );
    this._armRight.position.set(-4, 2, 0);

    // Body
    this._body.add(this.createBox(0, 0, 0, 8, 12, 4.1, 20, 20, material));
    this._body.add(
      this.createBox(0, 0, 0, 8, 12, 4.1, 20, 36, secondLayerMaterial, 0.5)
    );
    this._body;

    // Head
    this._head.add(this.createBox(0, 4, 0, 8, 8, 8, 8, 8, material));
    this._head.add(
      this.createBox(0, 4, 0, 8, 8, 8, 40, 8, secondLayerMaterial, 0.5)
    );
    this._head.position.set(0, 6, 0);

    // Legs
    this._legLeft.add(this.createBox(2, -12, 0, 4, 12, 4, 4, 20, material));
    this._legLeft.add(
      this.createBox(2, -12, 0, 4, 12, 4, 4, 52, secondLayerMaterial, 0.5)
    );

    this._legRight.add(this.createBox(-2, -12, 0, 4, 12, 4, 4, 20, material));
    this._legRight.add(
      this.createBox(-2, -12, 0, 4, 12, 4, 4, 36, secondLayerMaterial, 0.5)
    );

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

  private createBox(
    x: number,
    y: number,
    z: number,
    width: number,
    height: number,
    depth: number,
    textureX: number,
    textureY: number,
    material: THREE.MeshStandardMaterial,
    scale = 0
  ): THREE.Mesh {
    const box = new THREE.BoxGeometry(
      width + scale,
      height + scale,
      depth + scale
    );
    const mesh = new THREE.Mesh(box, material);

    mesh.position.set(x, y, z);

    this.createUVData(box, textureX, textureY, width, height, depth);

    return mesh;
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
