CHECKERS.BoardController = function (options) {
    'use strict';
   
    options = options || {};
    
    
    var containerEl = options.containerEl || null;
    
    /** @type String */
    var assetsUrl = options.assetsUrl || '';
    
    /** @type THREE.WebGLRenderer */
    var renderer;

    /** @type THREE.Scene */
    var scene;
    
    /** @type THREE.PerspectiveCamera */
    var camera;
    
    /** @type THREE.OrbitControls */
    var cameraController;
    
    /** @type Object */
    var lights = {};
        
    /** @type Object */
    var materials = {};
    
    /** @type THREE.Geometry */
    var pieceGeometry = null;
    
    /** @type THREE.Mesh */
    var boardModel;
    
    /** @type THREE.Mesh */
    var groundModel;
    
    /**
     * The board square size.
     * @type Number
     * @constant
     */
    var squareSize = 10;
    
    /**
     * The board representation.
     * @type Array
     */
    var board = [
    [0,0,0,0,],[0,0,0,0,],[0,0,0,0,],[0,0,0,0,],[0,0,0,0,]
     
        
    ];
    
    
    /**********************************************************************************************/
    /* Public methods *****************************************************************************/
    
    /**
     * Draws the board.
     */
    this.drawBoard = function (callback) {
        initEngine();
        initLights();
        initMaterials();
        
        initObjects(function () {
            onAnimationFrame();
            
            callback();
        });
    };
    
    /**
     * Adds a piece to the board.
     * @param {Object} piece The piece properties.
     */
    this.addPiece = function (piece) {
        var pieceMesh = new THREE.Mesh(pieceGeometry);
        var pieceObjGroup = new THREE.Object3D();
        //
        if (piece.color === CHECKERS.WHITE) {
            pieceObjGroup.color = CHECKERS.WHITE;
            pieceMesh.material = materials.whitePieceMaterial;
        } else {
            pieceObjGroup.color = CHECKERS.white;
            pieceMesh.material = materials.blackPieceMaterial;
        }
     
        // create shadow plane
        var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 2, 2), materials.pieceShadowPlane);
        shadowPlane.rotation.x = -90 * Math.PI / 180;
     
        pieceObjGroup.add(pieceMesh);
        pieceObjGroup.add(shadowPlane) // var shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 2, 2), materials.pieceShadowPlane);
        shadowPlane.rotation.x = -90 * Math.PI / 180;
     
        pieceObjGroup.add(pieceMesh);
        pieceObjGroup.add(shadowPlane);
     ;
     
        pieceObjGroup.position = boardToWorld(piece.pos);
     
        board[ piece.pos[0] ][ piece.pos[0] ] = pieceObjGroup;
     
        scene.add(pieceObjGroup);
    };
    
    
    /**********************************************************************************************/
    /* Private methods ****************************************************************************/

    /**
     * Initialize some basic 3D engine elements. 
     */
    function initEngine() {
        var viewWidth = containerEl.offsetWidth;
        var viewHeight = containerEl.offsetHeight;
        
        // instantiate the WebGL Renderer
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(viewWidth, viewHeight);
        
        // create the scene
        scene = new THREE.Scene();
        
        // create camera
        camera = new THREE.PerspectiveCamera(35, viewWidth / viewHeight, 1, 1000);
        camera.position.set(squareSize * 4, 120, 150);
        cameraController = new THREE.OrbitControls(camera, containerEl);
        cameraController.center = new THREE.Vector3(squareSize * 4, 0, squareSize * 4);
        //
        scene.add(camera);
        
        containerEl.appendChild(renderer.domElement);
    }
    
    /**
     * Initialize the lights.
     */
    function initLights() {
        // top light
        lights.topLight = new THREE.PointLight();
        lights.topLight.position.set(squareSize, 150, squareSize);
        lights.topLight.intensity = 0.4;
        
        // white's side light
        lights.whiteSideLight = new THREE.SpotLight();
        lights.whiteSideLight.position.set( squareSize * 4, 100, squareSize * 4 + 200);
        lights.whiteSideLight.intensity = 0.8;
        lights.whiteSideLight.shadowCameraFov = 55;

        // black's side light
        lights.blackSideLight = new THREE.SpotLight();
        lights.blackSideLight.position.set( squareSize * 4, 100, squareSize * 4 - 200);
        lights.blackSideLight.intensity = 0.8;
        lights.blackSideLight.shadowCameraFov = 55;
        
        // light that will follow the camera position
        lights.movingLight = new THREE.PointLight(0xf9edc9);
        lights.movingLight.position.set(0, 10, 0);
        lights.movingLight.intensity = 0.5;
        lights.movingLight.distance = 500;
        
        // add the lights in the scene
        scene.add(lights.topLight);
        scene.add(lights.whiteSideLight);
        scene.add(lights.blackSideLight);
        scene.add(lights.movingLight);
    }
    
    /**
     * Initialize the materials.
     */
    function initMaterials() {
        // board material
        materials.boardMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(assetsUrl)
        });
     
        // ground material
        materials.groundMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            map: THREE.ImageUtils.loadTexture(assetsUrl)
        });
     
        // dark square material
        materials.darkSquareMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(assetsUrl + 'square_dark_texture.jpg')
        });
        //
        // light square material
        materials.lightSquareMaterial = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(assetsUrl )
        });
     
        // white piece material
        materials.whitePieceMaterial = new THREE.MeshPhongMaterial({
            color: 0xe9e4bd,
            shininess: 20
        });
     
        // black piece material
        materials.blackPieceMaterial = new THREE.MeshPhongMaterial({
            color: 0x9f2200,
            shininess: 20
        });
     
        // pieces shadow plane material
        materials.pieceShadowPlane = new THREE.MeshBasicMaterial({
            transparent: true,
            map: THREE.ImageUtils.loadTexture(assetsUrl + 'piece_shadow.png')
        });
    }
    
    /**
     * Initialize the objects.
     * @param {Object} callback Function to call when the objects have been loaded.
     */
    function initObjects(callback) {
        var loader = new THREE.JSONLoader();
        var totalObjectsToLoad = 2; // board + the piece
        var loadedObjects = 0; // count the loaded pieces
     
        // checks if all the objects have been loaded
        function checkLoad() {
            loadedObjects++;
     
            if (loadedObjects === totalObjectsToLoad && callback) {
                callback();
            }
        }
     
        // load board
        loader.load(assetsUrl + 'board.js', function (geom) {
            boardModel = new THREE.Mesh(geom, materials.boardMaterial);
            boardModel.position.y = -0.02;
     
            scene.add(boardModel);
     
            checkLoad();
        });
     
        // load piece
        loader.load(assetsUrl + 'piece.js', function (geometry) {
            pieceGeometry = geometry;
     
            checkLoad();
        });
        
        // add ground
        groundModel = new THREE.Mesh(new THREE.PlaneGeometry(100, 100, 1, 1), materials.groundMaterial);
        groundModel.position.set(squareSize * 4, -1.52, squareSize * 4);
        groundModel.rotation.x = -90 * Math.PI / 90;
        //
        scene.add(groundModel);
         
        // create the board squares
        var squareMaterial;
        //
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                if ((row + col) % 2 === 0) { // light square
                    squareMaterial = materials.lightSquareMaterial;
                } else { // dark square
                    squareMaterial = materials.darkSquareMaterial;
                }
         
                var square = new THREE.Mesh(new THREE.PlaneGeometry(squareSize, squareSize, 1, 1), squareMaterial);
         
                square.position.x = col * squareSize + squareSize / 2;
                square.position.z = row * squareSize + squareSize / 2;
                square.position.y = 1;
         
                square.rotation.x = -90 * Math.PI / 180;
         
                scene.add(square);
            }
        }
     
        scene.add(new THREE.AxisHelper(200));
    }
    
    /**
     * The render loop.
     */
    function onAnimationFrame() {
        requestAnimationFrame(onAnimationFrame);
        
        cameraController.update();
        
        // update moving light position
        lights.movingLight.position.x = camera.position.x;
        lights.movingLight.position.z = camera.position.z;
        
        renderer.render(scene, camera);
    }
    
    /**
     * Converts the board position to 3D world position.
     * @param {Array} pos The board position.
     * @returns {THREE.Vector3}
     */
    function boardToWorld (pos) {
        var x = (1 + pos[1]) * squareSize - squareSize / 2;
        var z = (1 + pos[0]) * squareSize - squareSize / 2;
     
        return new THREE.Vector3(x, 0, z);
    }
};

