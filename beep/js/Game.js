var CHECKERS = {};

CHECKERS.Game = function (options) {
    'use strict';
    
    options = options || {};
    
    /**********************************************************************************************/
    /* Private properties *************************************************************************/
   
    /** @type CHECKERS.BoardController */
    var boardController = null;
    
    
    /**********************************************************************************************/
    /* Private methods ****************************************************************************/
   
    /**
     * Initializer.
     */
    function init() {
        boardController = new CHECKERS.BoardController({
            containerEl: options.containerEl,
            assetsUrl: options.assetsUrl
        });
        
        boardController.drawBoard();
    }

        function onBoardReady() {
        // setup the board pieces
        var row, col, piece;
        //
        for (row = 0; row < board.length; row++) {
            for (col = 0; col < board[row].length; col++) {
                if (row < 3 && (row + col) % 2) { // black piece
                    piece = {
                        color: CHECKERS.BLACK,
                        pos: [row, col]
                    };
                } else if (row > 4 && (row + col) % 2) { // white piece
                    piece = {
                        color: CHECKERS.WHITE,
                        pos: [row, col]
                    };
                } else { // empty square
                    piece = 0;
                }
     
                board[row][col] = piece;
     
                if (piece) {
                    boardController.addPiece(piece);
                }
            }
        }
    }
    
    init();
};