import { Vec3, addVec3, createVec3, normalizeVec3 } from '../math/vec3';

export const CUBE_POINTS = [
  createVec3(-1, 1, -1),
  createVec3(1, 1, -1),
  createVec3(1, 1, 1),
  createVec3(-1, 1, 1),
  createVec3(-1, -1, -1),
  createVec3(1, -1, -1),
  createVec3(1, -1, 1),
  createVec3(-1, -1, 1),
];

/**
 * Builds cube geometry.
 * @returns
 */
export const buildCube = (): Float32Array => {
  // Output data
  const data: number[] = [];

  // The 8 corners of the unit cube
  const [c1, c2, c3, c4, c5, c6, c7, c8] = CUBE_POINTS;

  // Top
  addQuad(data, c1, c2, c3, c4, createVec3(0, 1, 0));

  // Bottom
  addQuad(data, c8, c7, c6, c5, createVec3(0, -1, 0));

  // Back / South
  addQuad(data, c2, c1, c5, c6, createVec3(0, 0, -1));

  // Front / North
  addQuad(data, c4, c3, c7, c8, createVec3(0, 0, 1));

  // Left / West
  addQuad(data, c1, c4, c8, c5, createVec3(-1, 0, 0));

  // Right / East
  addQuad(data, c3, c2, c6, c7, createVec3(1, 0, 0));

  return new Float32Array(data);
};

/**
 * Builds sphere geometry.
 * @returns
 */
export const buildSphere = (): Float32Array => {
  const data: number[] = [];

  // The 6 "corners" of the sphere
  const p1 = createVec3(-1, 0, 0);
  const p2 = createVec3(1, 0, 0);
  const p3 = createVec3(0, -1, 0);
  const p4 = createVec3(0, 1, 0);
  const p5 = createVec3(0, 0, -1);
  const p6 = createVec3(0, 0, 1);

  const buildFace = (c1: Vec3, c2: Vec3, c3: Vec3, depth = 0): void => {
    if (depth === 3) {
      // Unit sphere, so we can use the positions as normals
      addTriangle(data, c1, c2, c3, c1, c2, c3);
    } else {
      const m1 = createVec3();
      const m2 = createVec3();
      const m3 = createVec3();

      // Calculate midpoints
      normalizeVec3(m1, addVec3(m1, c1, c2));
      normalizeVec3(m2, addVec3(m2, c2, c3));
      normalizeVec3(m3, addVec3(m3, c3, c1));

      // 4 sub triangles
      buildFace(c1, m1, m3, depth + 1);
      buildFace(m1, c2, m2, depth + 1);
      buildFace(m3, m2, c3, depth + 1);
      buildFace(m1, m2, m3, depth + 1);
    }
  };

  // Bottom half
  buildFace(p1, p6, p3);
  buildFace(p6, p2, p3);
  buildFace(p2, p5, p3);
  buildFace(p5, p1, p3);

  // Top half
  buildFace(p6, p1, p4);
  buildFace(p2, p6, p4);
  buildFace(p5, p2, p4);
  buildFace(p1, p5, p4);

  return new Float32Array(data);
};

/**
 * Adds a quad to the buffer set.
 * @param p1
 * @param p2
 * @param p3
 * @param p4
 */
export const addQuad = (data: number[], p1: Vec3, p2: Vec3, p3: Vec3, p4: Vec3, normal: Vec3): void => {
  addTriangle(data, p1, p2, p3, normal, normal, normal);
  addTriangle(data, p1, p3, p4, normal, normal, normal);
};

/**
 * Adds a triangle to the buffer set.
 * @param data
 * @param p1
 * @param p2
 * @param p3
 */
export const addTriangle = (data: number[], p1: Vec3, p2: Vec3, p3: Vec3, n1: Vec3, n2: Vec3, n3: Vec3): void => {
  addPoint(data, p1);
  addPoint(data, n1);
  addPoint(data, p2);
  addPoint(data, n2);
  addPoint(data, p3);
  addPoint(data, n3);
};

/**
 * Adds a point
 * @param data
 * @param p
 * @returns
 */
export const addPoint = (data: number[], p: Vec3): number => data.push(...p);
