import React, { Component } from 'react'
import React3 from 'react-three-renderer';
import THREE from 'three'

class Simple extends Component {
  constructor(props, context) {
    super(props, context);

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, 0, 3.25);

    this.state = {
      cubeRotation: new THREE.Euler(),
      lineRotation: new THREE.Euler()
    };

    // mycode
    var size = 500, step = 100;
    var geometry = new THREE.PlaneGeometry();
    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        )
      });
    };
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height
    const newHeight = height/2;

    return (<React3
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}
      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}

          position={this.cameraPosition}
        />
        <line
        rotation={this.state.lineRotation}
        >
          <planeGeometry
            width={width}
            height={5}
            widthSegments={5}
            heightSegments={5}
          />

          <lineBasicMaterial
            color={0x00ff00}
          />
        </line>
        <line
        >
          <planeGeometry
            width={width}
            height={5}
            widthSegments={5}
            heightSegments={5}
          />

          <lineBasicMaterial
            color={0x00ff00}
          />
        </line>

      </scene>
    </React3>);
  }
}
export default Simple