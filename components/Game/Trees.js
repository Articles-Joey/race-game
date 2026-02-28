import Tree from '@/components/Game/Tree'

export default function Trees(props) {

  // Simple seeded pseudo-random function
  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  return (
    <group>
      {[...Array(30)].map((item, i) => {

        const rand1 = seededRandom(i * 123.456);
        const rand2 = seededRandom(i * 789.123);
        const rand3 = seededRandom(i * 456.789);

        const scale = 0.3 + rand1 * 0.2; // 0.25 to 0.45
        
        const yRot = rand2 * Math.PI * 2; // 0 to 2π radians
        // Add some random offset to x and z positions for more natural placement
        const x = ((i - 10) * 3) + (rand3 - 0.5) * 2; // jitter x by up to ±1
        const z = -15 + (seededRandom(i * 321.654) - 0.5) * 2; // jitter z by up to ±1
        return (
          <Tree
            key={i}
            scale={scale}
            position={[x, -0.3, z]}
            rotation={[0, yRot, 0]}
          />
        );
      })}
    </group>
  );
}