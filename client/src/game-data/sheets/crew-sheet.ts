import { useGameStore } from '@/stores/game-store';
import { makeGang } from '../cohort-factory';
import { Effectable, Person, Thing } from '../game-data-types';
import Sheet from './sheet';

export enum Direction {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west'
}

export type Claim = Effectable & {
  position: { x: number; y: number };
  adjacent: Direction[];
};

export type Cohort = Thing & {
  cohortType: 'gang' | 'expert' | 'vehicle';
  gangType?: Effectable[]; // Only for gang cohorts
  expertise1?: string; // Only for expert cohorts
  expertise2?: string; // Only for expert cohorts

  edges: Effectable[]; // Fearsome, Independent, Loyal, Tenacious
  flaws: Effectable[]; // Principled, Savage, Unreliable, Wild
  harm: Effectable[];
  quality: number; // Equal to the crew's tier
  scale: number; // Equal to the crew's tier
};

export class Crew extends Sheet {
  ui: { [key: string]: boolean } = {};

  name: string = 'Untitled Crew';
  description: string = '';
  reputationType: string = 'Ambitious'; // Ambitious, Brutal, Daring, Honorable, Professional, Savvy, Subtle, or Strange
  lair: string = 'An abandoned warehouse';
  lairDistrict: string = "Crow's Foot";
  huntingGroundsDistrict: string = "Crow's Foot";

  reputation: number = 0; // 0-6
  turf: number = 0; // 0-6
  hold: 'weak' | 'strong' = 'strong';
  tier: number = 0; // 0-4

  heat: number = 0; // 0-9
  wantedLevel: number = 0; // 0-4

  coin: number = 0; // 0-16

  crewExperience: number = 0; // 0-10
  crewDefaultExperienceLabels: string[] = [
    'Contend with challenges above your current station',
    "Bolster the Crew's reputation or develop a new one",
    "Express the Crew's goals, drives, inner conflict, or essential nature"
  ];
  crewExperienceLabels: string[] = [];

  cohorts: Cohort[] = [];

  // This is modified by the specific crew type
  crewType: string = '';
  crewTypeDescription: string = '';
  specialAbilities: Effectable[] = [];
  image: string = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
  contacts: Person[] = [];
  crewUpgrades: Effectable[] = [];
  lairUpgrades: Effectable[] = [
    {
      id: 'carriage-house',
      name: 'Carriage',
      description: '',
      quantity: 0,
      maxQuantity: 2
    },
    {
      id: 'boat-house',
      name: 'Boat',
      description: '',
      quantity: 0,
      maxQuantity: 2
    },
    {
      id: 'hidden-lair',
      name: 'Hidden',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'quarters',
      name: 'Quarters',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'secure-lair',
      name: 'Secure',
      description: '',
      quantity: 0,
      maxQuantity: 2
    },
    {
      id: 'vault',
      name: 'Vault',
      description: '',
      quantity: 0,
      maxQuantity: 2
    },
    {
      id: 'workshop',
      name: 'Workshop',
      description: '',
      quantity: 0,
      maxQuantity: 1
    }
  ];
  trainingUpgrades: Effectable[] = [
    {
      id: 'insight',
      name: 'Insight',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'prowess',
      name: 'Prowess',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'resolve',
      name: 'Resolve',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'personal',
      name: 'Personal',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'mastery',
      name: 'Mastery',
      description: '',
      quantity: 0,
      maxQuantity: 4
    }
  ];
  qualityUpgrades: Effectable[] = [
    {
      id: 'documents',
      name: 'Documents',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'gear',
      name: 'Gear',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'implements',
      name: 'Implements',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'supplies',
      name: 'Supplies',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'tools',
      name: 'Tools',
      description: '',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'weapons',
      name: 'Weapons',
      description: '',
      quantity: 0,
      maxQuantity: 1
    }
  ];
  claims: Claim[] = [];
  huntingGroundsLabel: string = 'Hunting Grounds';
  huntingGrounds: Effectable[] = [];

  constructor() {
    super();
    this.sheetType = 'crew';
  }

  applyUpgradesDescriptionsFromCodex() {
    const descriptions =
      useGameStore().game?.codex.sheets.crew['upgrade-descriptions'];

    // Crew Upgrades
    this.crewUpgrades.forEach((upgrade: Effectable) => {
      const upgradeDescription = descriptions?.crew?.[upgrade.id];
      if (upgradeDescription) upgrade.description = upgradeDescription;
      else if (!upgrade.description)
        upgrade.description = 'no description found for ' + upgrade.id;
    });

    // Lair Upgrades
    this.lairUpgrades.forEach((upgrade: Effectable) => {
      const upgradeDescription = descriptions.lair[upgrade.id];
      if (upgradeDescription) upgrade.description = upgradeDescription;
      else if (!upgrade.description)
        upgrade.description = 'no description found for ' + upgrade.id;
    });

    // Training Upgrades
    this.trainingUpgrades.forEach((upgrade: Effectable) => {
      const upgradeDescription = descriptions.training[upgrade.id];
      if (upgradeDescription) upgrade.description = upgradeDescription;
      else if (!upgrade.description)
        upgrade.description = 'no description found for ' + upgrade.id;
    });

    // Quality Upgrades
    this.qualityUpgrades.forEach((upgrade: Effectable) => {
      const upgradeDescription = descriptions.quality[upgrade.id];
      if (upgradeDescription) upgrade.description = upgradeDescription;
      else if (!upgrade.description)
        upgrade.description = 'no description found for ' + upgrade.id;
    });
  }
}

export class Assassins extends Crew {
  constructor() {
    super();

    this.name = 'Untitled Assassins';
    this.crewType = 'Assassins';
    this.crewTypeDescription = 'Murderers for hire';
    this.image = 'e52f27b1-e5f6-42de-9889-c2d9aeeb3b0d';
    this.crewExperienceLabels = [
      'Execute a successful accident, disappearance, murder, or ransom operation'
    ];
    this.specialAbilities = [
      {
        id: 'assassins-deadly',
        name: 'Deadly',
        description:
          'Each PC may add +1 *Action Rating* to **Hunt**, **Prowl**, or **Skirmish** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-crows-veil',
        name: "Crow's Veil",
        description:
          "Your activities are hidden from the notice of the Death-seeker Crows and you don't take extra *Heat* when killing is involved on a Score",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-emberdeath',
        name: 'Emberdeath',
        description:
          "You know the arcane method to destroy a living victim's Spirit at the moment you kill them. Take [/stress 3 Stress] to channel electroplasmic energy from the ghost field to disintegrate the Spirit and dead body in a shower of sparking embers",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-no-traces',
        name: 'No Traces',
        description:
          'When you keep an operation quiet or make it look like an accident, you get half the [/rep Rep] value of the target (round up) instead of zero. When you end downtime with zero *Heat*, take [/rep +1 Rep]',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-patron',
        name: 'Patron',
        description:
          'When you advance your *Tier*, it costs half the *Coin* it normally would. Who is your patron? Why do they help you?',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-predators',
        name: 'Predators',
        description:
          'When you use stealth or subterfuge to commit murder, add [/dice +1] to the *Engagement* roll',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-vipers',
        name: 'Vipers',
        description:
          'When you acquire or craft poisons, you get [/result +1 Result Level] to your roll\n\nWhen you employ a poison, you are specially prepared to be immune to its effects',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'assassin-rigging',
        name: 'Assassin Rigging',
        description: '2 free load of weapons or gear.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ironhook-contacts',
        name: 'Ironhook Contacts',
        description: '+1 Tier in prison.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-skulks',
        name: 'Elite Skulks',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-thugs',
        name: 'Elite Thugs',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hardened',
        name: 'Hardened',
        description: '+1 trauma box.',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.contacts = [
      {
        id: 'assassins-trev',
        name: 'Trev',
        description: 'A gang boss',
        attitude: 0
      },
      {
        id: 'assassins-contact-lydra',
        name: 'Lydra',
        description: 'A deal broker',
        attitude: 0
      },
      {
        id: 'assassins-contact-irimina',
        name: 'Irimina',
        description: 'A vicious noble',
        attitude: 0
      },
      {
        id: 'assassins-contact-karlos',
        name: 'Karlos',
        description: 'A bounty hunter',
        attitude: 0
      },
      {
        id: 'assassins-contact-exeter',
        name: 'Exeter',
        description: 'A spirit warden',
        attitude: 0
      },
      {
        id: 'assassins-contact-sevoy',
        name: 'Sevoy',
        description: 'A merchant lord',
        attitude: 0
      }
    ];

    this.claims = [
      {
        id: 'assassins-training-room',
        name: 'Training Room',
        description: '[/scale +1 scale]\nSkulks Cohorts',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'assassins-vice-den',
        name: 'Vice Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'assassins-fixer',
        name: 'Fixer',
        description: '[/coin +2 Coin]\nLower-class targets',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH]
      },
      {
        id: 'assassins-informants',
        name: 'Informants',
        description: '[/dice +1] Gather Information',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'assassins-hagfish-farm',
        name: 'Hagfish Farm',
        description: 'Body disposal\n[/dice +1] Reduce Heat after killing',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'assassins-victim-trophies',
        name: 'Victim Trophies',
        description: '[/rep +1 Rep]\nper Score',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.SOUTH]
      },
      {
        id: 'assassins-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'assassins-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.EAST,
          Direction.SOUTH,
          Direction.WEST
        ]
      },
      {
        id: 'assassins-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.EAST]
      },
      {
        id: 'assassins-cover-operation',
        name: 'Cover Operation',
        description: '[/heat -2 Heat]\nper Score',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'assassins-protection-racket',
        name: 'Protection Racket',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'assassins-infirmary',
        name: 'Infirmary',
        description: '[/dice +1] Healing',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      },
      {
        id: 'assassins-envoy',
        name: 'Envoy',
        description: '[/coin +2 Coin]\nHigh-class targets',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH]
      },
      {
        id: 'assassins-cover-identities',
        name: 'Cover Identities',
        description: '[/dice +1] Engagement\n*Deception* and *Social plans*',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST]
      },
      {
        id: 'assassins-city-records',
        name: 'City Records',
        description: '[/dice +1] Engagement *Stealth plans*',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      }
    ];

    this.huntingGroundsLabel = 'Hunting Grounds';
    this.huntingGrounds = [
      {
        id: 'assassins-hunting-ground-accident',
        name: 'Accident',
        description: 'A killing with no telltale signs of murder',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-hunting-ground-disappearance',
        name: 'Disappearance',
        description: 'The victim vanishes without a trace',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-hunting-ground-murder',
        name: 'Murder',
        description: 'An obvious killing that sends a message',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'assassins-hunting-ground-ransom',
        name: 'Ransom',
        description: 'A kidnapping and demand for payment for their return',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'assassins-lair')!.quantity = 1;

    // Assassins start with Insight & Prowess training
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'insight'
    )!.quantity = 1;
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'prowess'
    )!.quantity = 1;
  }
}

export class Bravos extends Crew {
  constructor() {
    super();

    this.name = 'Untitled Bravos';
    this.crewType = 'Bravos';
    this.crewTypeDescription = 'Mercenaries, thugs, & killers';
    this.image = 'ab9c33a6-2710-41ff-a814-edf6b648af54';
    this.crewExperienceLabels = [
      'Execute a successful battle, extortion, sabotage, or smash & grab operation'
    ];
    this.specialAbilities = [
      {
        id: 'dangerous',
        name: 'Dangerous',
        description:
          'Each PC may add +1 *Action Rating* to **Hunt**, **Skirmish**, or **Wreck** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'blood-brothers',
        name: 'Blood Brothers',
        description:
          "When you fight alongside your Cohorts in combat, they get [/dice +1] for *Setup* and *Group Action* rolls\n\nAll of your Cohorts get the Thugs type for free. If they're already Thugs, add another type",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'door-kickers',
        name: 'Door Kickers',
        description:
          'When you execute an *Assault plan*, take [/dice +1] to the *Engagement* roll',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'fiends',
        name: 'Fiends',
        description:
          'Fear is as good as respect. You may count each *Wanted Level* as if it was Turf',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'forged-in-the-fire',
        name: 'Forged in the Fire',
        description:
          'Each PC has been toughened by cruel experience. You get [/dice +1] to *Resistance* rolls',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'patron',
        name: 'Patron',
        description:
          'When you advance your *Tier*, it costs half the *Coin* it normally would. Who is your patron? Why do they help you?',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'war-dogs',
        name: 'War Dogs',
        description:
          "When you're at *War* (-3 *Faction Status*), your Crew does not suffer -1 *Hold* and PCs still get two *Downtime Activities* instead of just one",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'bravos-rigging',
        name: 'Bravos Rigging',
        description: '2 free load of weapons or armor.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-skulks',
        name: 'Elite Skulks',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-thugs',
        name: 'Elite Thugs',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hardened',
        name: 'Hardened',
        description: '+1 trauma box.',
        quantity: 0,
        maxQuantity: 3
      },
      {
        id: 'ironhook-contacts',
        name: 'Ironhook Contacts',
        description: '+1 Tier in prison.',
        quantity: 0,
        maxQuantity: 1
      }
    ];
    this.contacts = [
      {
        id: 'bravos-contact-meg',
        name: 'Meg',
        description: 'A pit-fighter',
        attitude: 0
      },
      {
        id: 'bravos-contact-conway',
        name: 'Conway',
        description: 'A bluecoat',
        attitude: 0
      },
      {
        id: 'bravos-contact-keller',
        name: 'Keller',
        description: 'A blacksmith',
        attitude: 0
      },
      {
        id: 'bravos-contact-tomas',
        name: 'Tomas',
        description: 'A physicker',
        attitude: 0
      },
      {
        id: 'bravos-contact-walker',
        name: 'Walker',
        description: 'A ward boss',
        attitude: 0
      },
      {
        id: 'bravos-contact-lutes',
        name: 'Lutes',
        description: 'A tavern owner',
        attitude: 0
      }
    ];
    this.claims = [
      {
        id: 'bravos-barracks',
        name: 'Barracks',
        description: '[/scale +1 Scale]\nThug Cohorts',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'bravos-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.EAST]
      },
      {
        id: 'bravos-terrorized-citizens',
        name: 'Terrorized Citizens',
        description: '[/coin +2 Coin]\n*Battle* or *Extortion plans*',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'bravos-informants',
        name: 'Informants',
        description: '[/dice +1] Gather Information',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'bravos-protection-racket',
        name: 'Protection Racket',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'bravos-fighting-pits',
        name: 'Fighting Pits',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'bravos-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'bravos-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.EAST,
          Direction.SOUTH,
          Direction.WEST
        ]
      },
      {
        id: 'bravos-turf-3',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'bravos-turf-4',
        name: 'Turf',
        description: '',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'bravos-infirmary',
        name: 'Infirmary',
        description: '[/dice +1] Healing',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'bravos-bluecoat-intimidation',
        name: 'Bluecoat Intimidation',
        description: '[/heat -2 Heat]\nper Score',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      },
      {
        id: 'bravos-street-fence',
        name: 'Street Fence',
        description: '[/coin +2 Coin]\nLower-class targets',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'bravos-warehouses',
        name: 'Warehouses',
        description: 'Stockpiles give [/dice +1] *Acquire Assets*',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.EAST]
      },
      {
        id: 'bravos-bluecoat-confederates',
        name: 'Bluecoat Confederates',
        description: '[/dice +1] Engagement *Assault plans*',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      }
    ];

    this.huntingGroundsLabel = 'Hunting Grounds';
    this.huntingGrounds = [
      {
        id: 'bravos-hunting-ground-battle',
        name: 'Battle',
        description: 'Defeat an enemy with overwhelming force',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'bravos-hunting-ground-extortion',
        name: 'Extortion',
        description: "Threaten violence unless you're paid off",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'bravos-hunting-ground-sabotage',
        name: 'Sabotage',
        description: 'Hurt an opponent by destroying something',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'bravos-hunting-ground-smash-and-grab',
        name: 'Smash & Grab',
        description: 'A fast and violent armed robbery',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'bravos-lair')!.quantity = 1;

    // Bravos start with Prowess
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'prowess'
    )!.quantity = 1;

    // Bravos start with a Thugs gang cohort
    this.cohorts.push(makeGang('Thugs'));
  }
}

export class Cult extends Crew {
  public deityName: string;
  public deityFeatures: string;

  constructor() {
    super();

    this.name = 'Untitled Cult';
    this.crewType = 'Cult';
    this.crewTypeDescription = 'Acolytes of a deity';
    this.image = '7544b3a4-0e4d-4758-9870-cd5b8f7774cb';
    this.crewExperienceLabels = [
      'Advance the agenda of your deity or embody its precepts'
    ];
    this.specialAbilities = [
      {
        id: 'chosen',
        name: 'Chosen',
        description:
          'Each PC may add +1 *Action Rating* to **Attune**, **Study**, or **Sway** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'anointed',
        name: 'Anointed',
        description:
          'You get [/dice +1] to *Resistance* rolls against supernatural threats\n\nYou get [/dice +1] to healing rolls when you have supernatural harm',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'bound-in-darkness',
        name: 'Bound in Darkness',
        description:
          'You may use *Teamwork* with any cult member, regardless of the distance separating you\n\nTake [/stress 1 Stress] for your whispered message to be heard by every cultist',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'conviction',
        name: 'Conviction',
        description:
          "Each PC gains an additional *Vice*: Worship. You don't overindulge when indulging in Worship (if you provide a pleasing sacrifice)\n\nIn addition, your deity will grant [/dice +1] to one *Action Roll* you make—from now until you indulge in Worship again",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'glory-incarnate',
        name: 'Glory Incarnate',
        description:
          'Your deity sometimes manifests in the physical world. This can be a great boon, but the priorities and values of a god are not those of mortals\n\nYou have been warned',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'sealed-in-blood',
        name: 'Sealed in Blood',
        description:
          'Each human sacrifice yields -3 *Stress Cost* when performing a ritual',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'zealotry',
        name: 'Zealotry',
        description:
          'Your Cohorts have abandoned reason in devotion to the cult and will undertake any service, no matter how dangerous or strange\n\nThey gain [/dice +1] to rolls against enemies of the faith',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'cult-rigging',
        name: 'Cult Rigging',
        description: '2 free load of documents or implements.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ritual-sanctum-in-lair',
        name: 'Ritual Sanctum in Lair',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-adepts',
        name: 'Elite Adepts',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-thugs',
        name: 'Elite Thugs',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ordained',
        name: 'Ordained',
        description: '+1 trauma box.',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.contacts = [
      {
        id: 'cult-contact-gagan',
        name: 'Gagan',
        description: 'An academic',
        attitude: 0
      },
      {
        id: 'cult-contact-adikin',
        name: 'Adikin',
        description: 'An occultist',
        attitude: 0
      },
      {
        id: 'cult-contact-hutchins',
        name: 'Hutchins',
        description: 'An antiquarian',
        attitude: 0
      },
      {
        id: 'cult-contact-moriya',
        name: 'Moriya',
        description: 'A spirit trafficker',
        attitude: 0
      },
      {
        id: 'cult-contact-mateas-kline',
        name: 'Mateas Kline',
        description: 'A noble',
        attitude: 0
      },
      {
        id: 'cult-bennett',
        name: 'Bennett',
        description: 'An astronomer',
        attitude: 0
      }
    ];
    this.claims = [
      {
        id: 'cult-cloister',
        name: 'Cloister',
        description: '[/scale +1 Scale]\nAdept Cohorts',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'cult-vice-den',
        name: 'Vice Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH, Direction.EAST]
      },
      {
        id: 'cult-offertory',
        name: 'Offertory',
        description: '[/coin +2 Coin] *Occult plans*',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'cult-ancient-obelisk',
        name: 'Ancient Obelisk',
        description:
          '-1 *Stress Cost* for *Arcane Powers* and *Rituals*',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST]
      },
      {
        id: 'cult-ancient-tower',
        name: 'Ancient Tower',
        description: '[/dice +1] Consort w/ Arcane entities on-site',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'cult-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'cult-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'cult-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'cult-turf-3',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH, Direction.WEST, Direction.EAST]
      },
      {
        id: 'cult-turf-4',
        name: 'Turf',
        description: '',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'cult-spirit-well',
        name: 'Spirit Well',
        description: '[/dice +1] **Attune** on-site',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST]
      },
      {
        id: 'cult-ancient-gate',
        name: 'Ancient Gate',
        description: 'Safe passage into the Deathlands',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.NORTH]
      },
      {
        id: 'cult-sanctuary',
        name: 'Sanctuary',
        description: '[/dice +1] *Command* and *Sway* on-site',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH]
      },
      {
        id: 'cult-sacred-nexus',
        name: 'Sacred Nexus',
        description: '[/dice +1] Healing on-site',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'cult-ancient-altar',
        name: 'Ancient Altar',
        description: '[/dice +1] Engagement *Occult plans*',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      }
    ];

    this.huntingGroundsLabel = 'Sacred Sites';
    this.huntingGrounds = [
      {
        id: 'cult-sacred-site-acquisition',
        name: 'Acquisition',
        description: 'Procure an arcane artifact and attune it to your god',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cult-sacred-site-augury',
        name: 'Augury',
        description:
          "Do what you must to attract the god's attention and counsel",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cult-sacred-site-consecration',
        name: 'Consecration',
        description: 'Anoint a place for your deity',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cult-sacred-site-sacrifice',
        name: 'Sacrifice',
        description: 'Destroy what is valuable or good in honor of your god',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.deityName = '';
    this.deityFeatures = '';

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'cult-lair')!.quantity = 1;

    // Cult starts with Resolve
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'resolve'
    )!.quantity = 1;

    // Cult starts with a Adepts gang cohort
    this.cohorts.push(makeGang('Adepts'));
  }
}

export class Hawkers extends Crew {
  constructor() {
    super();

    this.name = 'Untitled Hawkers';
    this.crewType = 'Hawkers';
    this.crewTypeDescription = 'Vice dealers';
    this.image = '13867125-73d8-4399-a550-db499a4eedfe';
    this.crewExperienceLabels = [
      'Acquire product supply, execute clandestine/covert sales, or secure new territory'
    ];
    this.specialAbilities = [
      {
        id: 'silver-tongues',
        name: 'Silver Tongues',
        description:
          'Each PC may add +1 *Action Rating* to **Command**, **Consort**, or **Sway** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'accord',
        name: 'Accord',
        description:
          'Sometimes friends are as good as territory. Count up to three +3 *Faction Statuses* as Turf',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'the-good-stuff',
        name: 'The Good Stuff',
        description:
          'Your merchandise is exquisite. The product quality is equal to your *Tier* +2\n\nWhen you deal with a *Faction*, the GM will tell you who among them is hooked on your product (one, a few, many, or all)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-market',
        name: 'Ghost Market',
        description:
          'You have discovered how to prepare your product for sale to ghosts and/or demons\n\nThey do not pay in *Coin*. What do they pay with?',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'high-society',
        name: 'High Society',
        description:
          "It's all about who you know\n\nTake [/heat -1 Heat] during Downtime and [/dice +1] to Gather Information about the city's elite",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hooked',
        name: 'Hooked',
        description:
          'Your Cohorts use your product. Add the savage, unreliable, or wild *Flaw* to your Gangs to give them [/quality +1 Quality]',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'patron',
        name: 'Patron',
        description:
          'When you advance your *Tier*, it costs half the *Coin* it normally would. Who is your patron? Why do they help you?',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'hawker-rigging',
        name: 'Hawkers Rigging',
        description: '1 carried item is concealed and has no load',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ironhook-contacts',
        name: 'Ironhook Contacts',
        description: '+1 Tier in prison.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-rooks',
        name: 'Elite Rooks',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-thugs',
        name: 'Elite Thugs',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'composed',
        name: 'Composed',
        description: '+1 stress box.',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.contacts = [
      {
        id: 'hawkers-contact-rolan-wott',
        name: 'Rolan Wott',
        description: 'A magistrate',
        attitude: 0
      },
      {
        id: 'hawkers-contact-laroze',
        name: 'Laroze',
        description: 'A bluecoat',
        attitude: 0
      },
      {
        id: 'hawkers-contact-lydra',
        name: 'Lydra',
        description: 'A deal broker',
        attitude: 0
      },
      {
        id: 'hawkers-contact-hoxley',
        name: 'Hoxley',
        description: 'A smuggler',
        attitude: 0
      },
      {
        id: 'hawkers-contact-anya',
        name: 'Anya',
        description: 'A dilettante',
        attitude: 0
      },
      {
        id: 'hawkers-contact-marlo',
        name: 'Marlo',
        description: 'A gang boss',
        attitude: 0
      }
    ];
    this.claims = [
      {
        id: 'hawkers-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'hawkers-personal-clothier',
        name: 'Personal Clothier',
        description: '[/dice +1] Engagement *Social plans*',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'hawkers-local-graft',
        name: 'Local Graft',
        description: '[/coin +2 Coin]\n*Show of Force* or *Socialize plans*',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH]
      },
      {
        id: 'hawkers-lookouts',
        name: 'Lookouts',
        description: '[/dice +1] **Survey** and **Hunt** on Turf',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'hawkers-informants',
        name: 'Informants',
        // description: '+1 gather info for scores',
        description: '[/dice +1] Gather Information',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'hawkers-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.SOUTH]
      },
      {
        id: 'hawkers-turf-3',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'hawkers-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.EAST,
          Direction.SOUTH,
          Direction.WEST
        ]
      },
      {
        id: 'hawkers-turf-4',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'hawkers-luxury-venue',
        name: 'Luxury Venue',
        description: '[/dice +1] **Consort** and **Sway** on-site',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      },
      {
        id: 'hawkers-foreign-market',
        name: 'Foreign Market',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.NORTH]
      },
      {
        id: 'hawkers-vice-den',
        name: 'Vice Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      },
      {
        id: 'hawkers-surplus-caches',
        name: 'Surplus Caches',
        description: '[/coin +2 Coin]\n*Sale* or *Supply plans*',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH]
      },
      {
        id: 'hawkers-cover-operation',
        name: 'Cover Operation',
        description: '[/heat -2 Heat]\nper Score',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'hawkers-cover-identities',
        name: 'Cover Identities',
        description: '[/dice +1] Engagement *Deception* or *Transport plans*',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST]
      }
    ];

    this.huntingGroundsLabel = 'Sales Territory';
    this.huntingGrounds = [
      {
        id: 'hawkers-sales-territory-sale',
        name: 'Sale',
        description:
          'A significant transaction with a special buyer of illicit product',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hawkers-sales-territory-supply',
        name: 'Supply',
        description:
          'A transaction to acquire new product or establish a new supplier',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hawkers-sales-territory-show-of-force',
        name: 'Show of Force',
        description: 'Make an example of an enemy to dominate territory',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'hawkers-sales-territory-socialize',
        name: 'Socialize',
        description:
          'Improve customer and/or supplier relations with a social event',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'hawkers-lair')!.quantity = 1;

    // Hawkers start with Resolve
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'resolve'
    )!.quantity = 1;

    // Hawkers start with the Secure-lair upgrade
    this.lairUpgrades.find(
      (upgrade) => upgrade.id === 'secure-lair'
    )!.quantity = 1;

    console.log(this.lairUpgrades);
  }
}

export class Shadows extends Crew {
  constructor() {
    super();

    this.name = 'Untitled Shadows';
    this.crewType = 'Shadows';
    this.crewTypeDescription = 'Thieves, spies, and saboteurs';
    this.image = 'bbc1bf16-dc4d-4e97-a898-0bf9e688d327';
    this.crewExperienceLabels = [
      'Execute a successful espionage, sabotage, or theft operation'
    ];
    this.specialAbilities = [
      {
        id: 'everyone-steals',
        name: 'Everyone Steals',
        description:
          'Each PC may add +1 *Action Rating* to **Prowl**, **Finesse**, or **Tinker** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-echoes',
        name: 'Ghost Echoes',
        description:
          'All Crew members gain the ability to see and interact with the ghostly structures, streets, and objects within the echo of Duskwall that exists in the Ghost Field.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'pack-rats',
        name: 'Pack Rats',
        description:
          'Your Lair is a jumble of stolen items. Take [/dice +1d] when you *Acquire an Asset*',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'patron',
        name: 'Patron',
        description:
          'When you advance your *Tier*, it costs half the *Coin* it normally would. Who is your patron? Why do they help you?',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'second-story',
        name: 'Second Story',
        description:
          'When you execute a clandestine infiltration, you get [/dice +1] to the *Engagement* roll',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'slippery',
        name: 'Slippery',
        description:
          'When you roll *Entanglements*, roll twice and keep the one you want\n\nTake [/dice +1] when you reduce *Heat*',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'synchronized',
        name: 'Synchronized',
        description:
          'When you perform a *Group Action* you may count multiple 6s from different rolls as a Critical Success',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'thief-rigging',
        name: 'Thief Rigging',
        description: '2 free load of tools or gear.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'underground-maps-and-passkeys',
        name: 'Underground Maps and Passkeys',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-rooks',
        name: 'Elite Rooks',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-skulks',
        name: 'Elite Skulks',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'steady',
        name: 'Steady',
        description: '+1 stress box.',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.contacts = [
      {
        id: 'shadows-contact-dowler',
        name: 'Dowler',
        description: 'An explorer',
        attitude: 0
      },
      {
        id: 'shadows-contact-laroze',
        name: 'Laroze',
        description: 'A bluecoat',
        attitude: 0
      },
      {
        id: 'shadows-contact-amancio',
        name: 'Amancio',
        description: 'A deal broker',
        attitude: 0
      },
      {
        id: 'shadows-contact-fitz',
        name: 'Fitz',
        description: 'A collector',
        attitude: 0
      },
      {
        id: 'shadows-contact-adelaide-phroaig',
        name: 'Adelaide Phroaig',
        description: 'A noble',
        attitude: 0
      },
      {
        id: 'shadows-contact-rigney',
        name: 'Rigney',
        description: 'A tavern owner',
        attitude: 0
      }
    ];
    this.claims = [
      {
        id: 'shadows-interrogation-chamber',
        name: 'Interrogation Chamber',
        description: '[/dice +1] **Command** and **Sway** on-site',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'shadows-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.EAST]
      },
      {
        id: 'shadows-loyal-fence',
        name: 'Loyal Fence',
        description: '[/coin +2 Coin] *Burglary* or *Robbery plans*',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'shadows-gambling-den',
        name: 'Gambling Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'shadows-tavern',
        name: 'Tavern',
        description: '[/dice +1] **Consort** and **Sway** on-site',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'shadows-drug-den',
        name: 'Drug Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'shadows-informants',
        name: 'Informants',
        description: '[/dice +1] Gather Information',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH, Direction.WEST, Direction.EAST]
      },
      {
        id: 'shadows-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'shadows-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.EAST]
      },
      {
        id: 'shadows-lookouts',
        name: 'Lookouts',
        description: '[/dice +1] **Survey** and **Hunt** on Turf',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'shadows-hagfish-farm',
        name: 'Hagfish Farm',
        description: 'Body disposal\n[/dice +1] Reduce Heat after killing',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.NORTH]
      },
      {
        id: 'shadows-infirmary',
        name: 'Infirmary',
        description: '[/dice +1] Healing',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.NORTH]
      },
      {
        id: 'shadows-covert-drops',
        name: 'Covert Drops',
        description: '+2 coin for espionage or sabotage',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'shadows-turf-3',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.EAST]
      },
      {
        id: 'shadows-secret-pathways',
        name: 'Secret Pathways',
        description: '+1d engagement for stealth plans',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.NORTH]
      }
    ];

    this.huntingGroundsLabel = 'Hunting Grounds';
    this.huntingGrounds = [
      {
        id: 'shadows-hunting-grounds-burglary',
        name: 'Burglary',
        description: 'Theft by breaking and entering',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'shadows-hunting-grounds-espionage',
        name: 'Espionage',
        description: 'Obtain secret information by covert or clandestine means',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'shadows-hunting-grounds-robbery',
        name: 'Robbery',
        description: 'Theft by force or threats',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'shadows-hunting-grounds-sabotage',
        name: 'Sabotage',
        description: 'Hurt an opponent by destroying something',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'shadows-lair')!.quantity = 1;

    // Shadows start with Prowess
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'prowess'
    )!.quantity = 1;

    // Shadows start with the hidden upgrade
    this.lairUpgrades.find(
      (upgrade) => upgrade.id === 'hidden-lair'
    )!.quantity = 1;
  }
}

export class Smugglers extends Crew {
  constructor() {
    super();

    this.name = 'Untitled Smugglers';
    this.crewType = 'Smugglers';
    this.crewTypeDescription = 'Suppliers of illicit goods';
    this.image = 'de509b5c-f37c-4975-9768-5e123d24e19b';
    this.crewExperienceLabels = [
      'Execute a successful smuggling or acquire new clients or contraband sources'
    ];
    this.specialAbilities = [
      {
        id: 'like-part-of-the-family',
        name: 'Like Part of the Family',
        description:
          'Create one of your vehicles as a Cohort. Its *Quality* is equal to your *Tier* +1.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'all-hands',
        name: 'All Hands',
        description:
          'One of your Cohorts may perform a *Downtime Activity* for the Crew to *Acquire an Asset*, reduce *Heat*, or work on a *Long-term Project*',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-passage',
        name: 'Ghost Passage',
        description:
          'All crew members become immune to possession by Spirits, but may choose to "carry" a Ghost as a passenger within their body.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'just-passing-through',
        name: 'Just Passing Through',
        description:
          '[/heat -1 Heat] in Downtime\n\nWhen your *Heat* is 4 or less, take [/dice +1] to deceive people when you pass yourselves off as ordinary citizens',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'leverage',
        name: 'Leverage',
        description:
          'Your Crew supplies contraband for other *Factions*. Your success is good for them\n\nGain [/rep +1 Rep] whenever you gain *Rep*',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'reavers',
        name: 'Reavers',
        description:
          'When you go into conflict aboard a vehicle, you gain +1 *Effect* for vehicle damage and speed\n\nYour vehicle gains Armor',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'renegades',
        name: 'Renegades',
        description:
          'Each PC may add +1 *Action Rating* to **Finesse**, **Prowl**, or **Skirmish** (up to a max of 3)',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a *Special Ability* from another crew',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.crewUpgrades = [
      {
        id: 'smugglers-rigging',
        name: 'Smugglers Rigging',
        description: '2 items carried are perfectly concealed.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'camoflage',
        name: 'Camoflage',
        description: 'Vehicles are perfectly concealed at rest',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'elite-rovers',
        name: 'Elite Rovers',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'barge',
        name: 'Barge',
        description: '',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'steady',
        name: 'Steady',
        description: '+1 stress box.',
        quantity: 0,
        maxQuantity: 3
      }
    ];
    this.contacts = [
      {
        id: 'smugglers-contact-elynn',
        name: 'Elynn',
        description: 'A dock worker',
        attitude: 0
      },
      {
        id: 'smugglers-contact-rolan',
        name: 'Rolan',
        description: 'A drug dealer',
        attitude: 0
      },
      {
        id: 'smugglers-contact-sera',
        name: 'Sera',
        description: 'An arms dealer',
        attitude: 0
      },
      {
        id: 'smugglers-contact-nyelle',
        name: 'Nyelle',
        description: 'A spirit trafficker',
        attitude: 0
      },
      {
        id: 'smugglers-contact-decker',
        name: 'Decker',
        description: 'An anarchist',
        attitude: 0
      },
      {
        id: 'smugglers-contact-esme',
        name: 'Esme',
        description: 'A tavern owner',
        attitude: 0
      }
    ];
    this.claims = [
      {
        id: 'smugglers-turf-1',
        name: 'Turf',
        description: '',
        position: { x: 0, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'smugglers-side-business',
        name: 'Side Business',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 1, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'smugglers-luxury-fence',
        name: 'Luxury Fence',
        // description: '+2 coin for high-class targets',
        description: '[/coin +2]\nHigh-class targets',
        position: { x: 2, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH]
      },
      {
        id: 'smugglers-vice-den',
        name: 'Vice Den',
        description: '[/coin +Coin]\n[/dice Tier] - *Heat*',
        position: { x: 3, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'smugglers-tavern',
        name: 'Tavern',
        description: '[/dice +1] **Consort** and **Sway** on-site',
        position: { x: 4, y: 0 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'smugglers-ancient-gate',
        name: 'Ancient Gate',
        description: 'Safe passage into the Deathlands',
        position: { x: 0, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.SOUTH, Direction.NORTH]
      },
      {
        id: 'smugglers-turf-2',
        name: 'Turf',
        description: '',
        position: { x: 1, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST, Direction.SOUTH]
      },
      {
        id: 'smugglers-lair',
        name: 'Lair',
        description: '',
        position: { x: 2, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'smugglers-turf-3',
        name: 'Turf',
        description: '',
        position: { x: 3, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [
          Direction.NORTH,
          Direction.WEST,
          Direction.EAST,
          Direction.SOUTH
        ]
      },
      {
        id: 'smugglers-turf-4',
        name: 'Turf',
        description: '',
        position: { x: 4, y: 1 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST, Direction.SOUTH]
      },
      {
        id: 'smugglers-secret-routes',
        name: 'Secret Routes',
        description: '[/dice +1] Engagement *Transport plans*',
        position: { x: 0, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.EAST, Direction.NORTH]
      },
      {
        id: 'smugglers-informants',
        name: 'Informants',
        description: '[/dice +1] Gather Information',
        position: { x: 1, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.WEST, Direction.NORTH]
      },
      {
        id: 'smugglers-fleet',
        name: 'Fleet',
        description: 'Cohorts have their own vehicles',
        position: { x: 2, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH]
      },
      {
        id: 'smugglers-cover-operation',
        name: 'Cover Operation',
        description: '[/heat -2] per Score',
        position: { x: 3, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.EAST]
      },
      {
        id: 'smugglers-warehouse',
        name: 'Warehouse',
        description: 'Stockpiles give [/dice +1] *Acquire Assets*',
        position: { x: 4, y: 2 },
        quantity: 0,
        maxQuantity: 1,
        adjacent: [Direction.NORTH, Direction.WEST]
      }
    ];

    this.huntingGroundsLabel = 'Cargo Types';
    this.huntingGrounds = [
      {
        id: 'smugglers-cargo-type-arcane-weird',
        name: 'Arcane/Weird',
        description: 'Spirit essences, ghosts, cult materials',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'smugglers-cargo-type-arms',
        name: 'Arms',
        description: 'Restricted military weapons, heavy ordnance, explosives',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'smugglers-cargo-type-contraband',
        name: 'Contraband',
        description: 'High-tax luxuries, drugs, banned art, etc',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'smugglers-cargo-type-passengers',
        name: 'Passengers',
        description: 'People or livestock traveling in secret',
        quantity: 0,
        maxQuantity: 1
      }
    ];

    this.applyUpgradesDescriptionsFromCodex();
    this.applyStartingUpgrades();
  }

  applyStartingUpgrades() {
    // Start with the lair
    this.claims.find((claim) => claim.id === 'smugglers-lair')!.quantity = 1;

    // Smugglers start with Prowess
    this.trainingUpgrades.find(
      (upgrade) => upgrade.id === 'prowess'
    )!.quantity = 1;

    // Remove the carriage and boat upgrades, and replace them with generic vehicles
    this.lairUpgrades = this.lairUpgrades.filter(
      (upgrade) =>
        upgrade.id !== 'carriage-house' && upgrade.id !== 'boat-house'
    );

    // Smugglers start with one upgrade in one vehicle
    for (let i = 1; i <= 2; i++)
      this.lairUpgrades.push({
        id: `vehicle-${i}`,
        name: `Vehicle ${i}`,
        description:
          'Either a carriage or a boat, along with the relevant stable or boat-house.',
        quantity: i == 1 ? 1 : 0,
        maxQuantity: 2
      });
  }
}

export function createCrewTemplates() {
  return {
    assassins: new Assassins(),
    bravos: new Bravos(),
    cult: new Cult(),
    hawkers: new Hawkers(),
    shadows: new Shadows(),
    smugglers: new Smugglers()
  };
}
