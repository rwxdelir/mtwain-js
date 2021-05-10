const Z_ROT = [
    [
      [ 0, 0, 0, 0 ], 
      [ 1, 1, 0, 0 ], 
      [ 0, 1, 1, 0 ]
    ], 
    [
      [ 0, 0, 1 ], 
      [ 0, 1, 1 ], 
      [ 0, 1, 0 ]
    ]
  ];
  
const S_ROT = [
    [
      [ 0, 0, 0 ],
      [ 0, 1, 1 ],
      [ 1, 1, 0 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 0, 1, 1 ],
      [ 0, 0, 1 ]
    ]
  ];
  
const O_ROT = [
    [
      [ 1, 1 ],
      [ 1, 1 ]
    ]
  ];
  
const L_ROT = [
    [
      [ 0, 0, 0 ],
      [ 1, 1, 1 ],
      [ 1, 0, 0 ]
    ],
    [
      [ 1, 1, 0 ],
      [ 0, 1, 0 ],
      [ 0, 1, 0 ]
    ],
    [
      [ 0, 0, 1 ],
      [ 1, 1, 1 ],
      [ 0, 0, 0 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 0, 1, 0 ],
      [ 0, 1, 1 ]
    ]
  ];
  
const J_ROT = [
    [
      [ 0, 0, 0 ],
      [ 1, 1, 1 ],
      [ 0, 0, 1 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 0, 1, 0 ],
      [ 1, 1, 0 ]
    ],
    [
      [ 1, 0, 0 ],
      [ 1, 1, 1 ],
      [ 0, 0, 0 ]
    ],
    [
      [ 0, 1, 1 ],
      [ 0, 1, 0 ],
      [ 0, 1, 0 ]
    ]
  ];
  
const T_ROT = [
    [
      [ 0, 0, 0 ],
      [ 1, 1, 1 ],
      [ 0, 1, 0 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 1, 1, 0 ],
      [ 0, 1, 0 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 1, 1, 1 ],
      [ 0, 0, 0 ]
    ],
    [
      [ 0, 1, 0 ],
      [ 0, 1, 1 ],
      [ 0, 1, 0 ]
    ]
  ];
  
const I_ROT = [
    [
      [ 0, 0, 0, 0 ],
      [ 0, 0, 0, 0 ],
      [ 1, 1, 1, 1 ],
      [ 0, 0, 0, 0 ]
    ], 
    [
      [ 0, 0, 1, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 1, 0 ],
      [ 0, 0, 1, 0 ]
    ]
  ];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Initial positions inside board map
const Z_INI_POS = [3, -2];
const S_INI_POS = [3, -2];
const O_INI_POS = [3, -1];
const L_INI_POS = [3, -2];
const J_INI_POS = [3, -2];
const T_INI_POS = [3, -2];
const I_INI_POS = [3, -3];

// Initial positions inside next piece placeholder 
const Z_NEXT_POS = [0, -4];
const S_NEXT_POS = [0, -4];
const O_NEXT_POS = [0.5, -3];
const L_NEXT_POS = [0, -4];
const J_NEXT_POS = [0, -4];
const T_NEXT_POS = [0, -4];
const I_NEXT_POS = [-1, -5];

