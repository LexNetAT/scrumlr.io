import { PhaseConfiguration } from '../Retrospective';

export default [
  {
    name: 'Write',
    description: 'Create cards, communicate your thoughts & stack common',
    columns: [
      {
        id: 'plus',
        name: 'Plus',
        type: 'positive',
        voting: {
          enabled: false,
          displayed: false
        },
        focus: {
          enabled: true,
          column: 'plus',
          align: 'right'
        },
        sorted: false
      },
      {
        id: 'delta',
        name: 'Delta',
        type: 'negative',
        voting: {
          enabled: false,
          displayed: false
        },
        focus: {
          enabled: true,
          column: 'delta',
          align: 'left'
        },
        sorted: false
      }
    ],
    activities: [
      { icon: 'phase1-create', description: 'Create cards' },
      { icon: 'phase1-communicate', description: 'Communicate meaning' },
      { icon: 'phase1-combine', description: 'Combine to stack' }
    ]
  },
  {
    name: 'Vote',
    description: 'Vote on the most important cards for yourself',
    columns: [
      {
        id: 'plus',
        name: 'Plus',
        type: 'positive',
        voting: {
          enabled: true,
          displayed: false
        },
        focus: {
          enabled: false,
          column: 'plus',
          align: 'right'
        },
        sorted: false
      },
      {
        id: 'delta',
        name: 'Delta',
        type: 'negative',
        voting: {
          enabled: true,
          displayed: false
        },
        focus: {
          enabled: false,
          column: 'delta',
          align: 'left'
        },
        sorted: false
      }
    ],
    activities: [{ icon: 'phase2-vote', description: 'Vote wisely' }]
  },
  {
    name: 'Discuss',
    description: 'Discuss top-voted cards and define actions',
    columns: [
      {
        id: 'plus',
        name: 'Plus',
        type: 'positive',
        voting: {
          enabled: false,
          displayed: true
        },
        focus: {
          enabled: true,
          column: 'actions',
          align: 'right'
        },
        sorted: true
      },
      {
        id: 'delta',
        name: 'Delta',
        type: 'negative',
        voting: {
          enabled: false,
          displayed: true
        },
        focus: {
          enabled: true,
          column: 'actions',
          align: 'right'
        },
        sorted: true
      },
      {
        id: 'actions',
        name: 'Actions',
        type: 'actions',
        voting: {
          enabled: false,
          displayed: true
        },
        focus: {
          enabled: false,
          column: 'actions',
          align: 'right'
        },
        sorted: false
      }
    ],
    activities: [
      { icon: 'phase3-discuss', description: 'Discuss top-voted' },
      { icon: 'phase3-define', description: 'Define actions' }
    ]
  }
] as PhaseConfiguration[];
