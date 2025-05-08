import { Clock, Effectable, Item, Person } from '../game-data-types';
import Sheet from './sheet';

export type Harm = {
  level: number; // 0-4
  description: string;
};

export class Character extends Sheet {
  ui: { [key: string]: boolean } = {};

  crewId: string = ''; // The  crew this character is a part of

  characterType: string = '';
  characterTypeDescription: string = '';
  image: string = '';

  name: string = 'Unnamed Character';
  alias: string = '';
  look: string = '';
  heritage: string;
  heritageDescription: string;
  background: string;
  backgroundDescription: string;
  notes: string = '';

  vice: string = '';
  viceDescription: string = '';
  vicePurveyor: string = '';

  contacts: Person[] = [];
  contactsLabel: string = 'Contacts';

  stress: number = 0; // 0-9
  maxStress: number = 9;

  traumas: Effectable[];
  maxTraumas: number = 4;

  harms: Harm[] = [
    {
      level: 3,
      description: ''
    },
    {
      level: 2,
      description: ''
    },
    {
      level: 2,
      description: ''
    },
    {
      level: 1,
      description: ''
    },
    {
      level: 1,
      description: ''
    }
  ];

  healingClock: Clock = {
    id: 'healing',
    name: '',
    description:
      'Roll **Tinker** for a PC with the *Physicker* Special Ability or the *Quality Level* of an NPC) and then mark a number of segments on your Healing clock.\n\n❖ 1-3: one segment\n❖ 4/5: two segments\n❖ 6: three segments\n❖ Critical: five segments',
    segments: 4,
    value: 0
  };

  armorUsed: boolean = false;
  heavyArmorUsed: boolean = false;
  specialArmorUsed: boolean = false;

  playbookXP: number = 0;
  maxPlaybookXP: number = 8;
  insightXP: number = 0;
  maxInsightXP: number = 6;
  prowessXP: number = 0;
  maxProwessXP: number = 6;
  resolveXP: number = 0;
  maxResolveXP: number = 6;

  attrAttune = {
    id: 'attr-attune',
    name: 'Attune',
    description:
      'Attune to spirits and the ghost field; channel electroplasmic energy; perceive and communicate with ghosts; understand spectrology.',
    quantity: 0,
    maxQuantity: 4
  };

  attrCommand = {
    id: 'attr-command',
    name: 'Command',
    description:
      "Command obedience with your force of personality; intimidate or threaten; lead an action with one of the crew's gangs.",
    quantity: 0,
    maxQuantity: 4
  };

  attrConsort = {
    id: 'attr-consort',
    name: 'Consort',
    description:
      'Consort with connections from your heritage, background, friends, or rivals to gain access to resources, information, people, or places.',
    quantity: 0,
    maxQuantity: 4
  };

  attrFinesse = {
    id: 'attr-finesse',
    name: 'Finesse',
    description:
      "Finesse an item from someone's pocket; employ subtle misdirection or sleight-of-hand; handle a vehicle or a mount.",
    quantity: 0,
    maxQuantity: 4
  };

  attrHunt = {
    id: 'attr-hunt',
    name: 'Hunt',
    description:
      'Hunt a target; gather information about its location and movements; attack with precision shooting from a distance.',
    quantity: 0,
    maxQuantity: 4
  };

  attrProwl = {
    id: 'attr-prowl',
    name: 'Prowl',
    description:
      'Prowl about unseen and traverse obstacles; climb, swim, run, jump, and tumble. Ambush with close violence—a backstab, throat cutting, black-jack, etc.',
    quantity: 0,
    maxQuantity: 4
  };

  attrSkirmish = {
    id: 'attr-skirmish',
    name: 'Skirmish',
    description:
      'Skirmish with an opponent in close combat; assault or hold a position; brawl and wrestle.',
    quantity: 0,
    maxQuantity: 4
  };

  attrStudy = {
    id: 'attr-study',
    name: 'Study',
    description:
      'Study a person, document, or item with close scrutiny to gather information and apply knowledge; gain a deeper understanding; do research.',
    quantity: 0,
    maxQuantity: 4
  };

  attrSurvey = {
    id: 'attr-survey',
    name: 'Survey',
    description:
      "Survey a location or situation to understand what's going on; sense trouble before it happens; gather information about opportunities or exploits.",
    quantity: 0,
    maxQuantity: 4
  };

  attrSway = {
    id: 'attr-sway',
    name: 'Sway',
    description:
      'Sway someone with charm, logic, deception, disguise, or bluff; change attitudes or behavior with manipulation or seduction.',
    quantity: 0,
    maxQuantity: 4
  };

  attrTinker = {
    id: 'attr-tinker',
    name: 'Tinker',
    description:
      'Tinker with mechanisms to create, modify, disable, or repair; disable a trap, pick a lock, or crack a safe. Use the ubiquitous clockwork and electroplasmic devices around the city to your advantage.',
    quantity: 0,
    maxQuantity: 4
  };

  attrWreck = {
    id: 'attr-wreck',
    name: 'Wreck',
    description:
      'Wreck a place, item, or obstacle with savage force or carefully applied sabotage; breach defenses with force; create distractions and chaos.',
    quantity: 0,
    maxQuantity: 4
  };

  specialAbilities: Effectable[] = [];

  load = [
    {
      id: 'light',
      name: 'Light',
      max: 3,
      description:
        "You're faster, less conspicuous; you blend in with citizens."
    },
    {
      id: 'normal',
      name: 'Normal',
      max: 5,
      description: 'You look like a scoundrel, ready for trouble.'
    },
    {
      id: 'heavy',
      name: 'Heavy',
      max: 6,
      description: "You're slower. You look like an operative on a mission."
    }
  ];

  selectedLoad: string | null = null;

  items: Item[] = [
    {
      id: 'a-blade-or-two',
      name: 'A Blade or Two',
      description:
        "Perhaps you carry a simple fighting knife. Or two curved swords. Or a rapier and stiletto. Or a heavy butcher's cleaver.",
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'throwing-knives',
      name: 'Throwing Knives',
      description: 'Six small, light blades.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'a-pistol',
      name: 'A Pistol',
      description:
        'A heavy, single-shot, breech-loading firearm. Devastating at 20 paces, slow to reload.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'a-large-weapon',
      name: 'A Large Weapon',
      description:
        'A weapon meant for two hands. A battle-axe, greatsword, warhammer, or pole-arm. A hunting rifle. A blunderbuss. A bow or crossbow.',
      quantity: 0,
      maxQuantity: 1,
      load: 2
    },
    {
      id: 'an-unusual-weapon',
      name: 'An Unusual Weapon',
      description:
        'A curiosity or tool turned into a weapon. A whip, a flail, a hatchet, a shovel, a length of chain, a razor-edged fan, steel-toed boots.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'armor',
      name: 'Armor',
      description: 'A thick leather tunic plus reinforced gloves and boots.',
      quantity: 0,
      maxQuantity: 1,
      load: 2
    },
    {
      id: 'heavy-armor',
      name: 'Heavy Armor',
      description: 'The addition of chain mail, metal plates, a metal helm.',
      quantity: 0,
      maxQuantity: 1,
      load: 3
    },
    {
      id: 'burglary-gear',
      name: 'Burglary Gear',
      description:
        'A set of lockpicks. A small pry-bar. Vials of oil to silence squeaky hinges. A coil of wire and fishing hooks. A small pouch of fine sand.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'climbing-gear',
      name: 'Climbing Gear',
      description:
        'A large coil of rope. A small coil of rope. Grappling hooks. A small pouch of chalk dust. A climbing harness with loops and metal rings. A set of iron pitons and a small mallet.',
      quantity: 0,
      maxQuantity: 1,
      load: 2
    },
    {
      id: 'documents',
      name: 'Documents',
      description:
        'A collection of slim volumes on a variety of topics, including a registry of the nobility, City Watch commanders, and other notable citizens. Blank pages, a vial of ink, a pen. A number of interesting maps.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'arcane-implements',
      name: 'Arcane Implements',
      description:
        'A vial of quicksilver. A pouch of black salt. A spirit anchor in the form of a small stone. A spirit bottle. A vial of electroplasm, designed to break and splatter on impact.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'subterfuge-supplies',
      name: 'Subterfuge Supplies',
      description:
        "A theatrical make-up kit. A selection of blank documents, ready for the forger's hand. Costume jewelry. A reversible cloak and distinctive hat. A forged badge of office.",
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'demolition-tools',
      name: 'Demolition Tools',
      description: 'A sledgehammer and iron spikes. Heavy drill. Crowbar.',
      quantity: 0,
      maxQuantity: 1,
      load: 2
    },
    {
      id: 'tinkering-tools',
      name: 'Tinkering Tools',
      description:
        "An assortment for detailed mechanist work: jeweler's loupe, tweezers, a small hammer, pliers, screwdriver, etc.",
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'lantern',
      name: 'Lantern',
      description:
        'A simple oil lantern, a fancy electroplasmic lamp, or other light source.',
      quantity: 0,
      maxQuantity: 1,
      load: 1
    },
    {
      id: 'spiritbane-charm',
      name: 'Spiritbane Charm',
      description: 'A small arcane trinket that ghosts prefer to avoid.',
      quantity: 0,
      maxQuantity: 1,
      load: 0
    }
  ];

  constructor() {
    super();
    this.sheetType = 'character';
    this.traumas = [
      {
        id: 'cold',
        name: 'Cold',
        description: "You're not moved by emotional appeals or social bonds.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'haunted',
        name: 'Haunted',
        description:
          "You're often lost in reverie, reliving past horrors, seeing things.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'obsessed',
        name: 'Obsessed',
        description:
          "You're enthralled by one thing: an activity, a person, an ideology.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'paranoid',
        name: 'Paranoid',
        description: "You imagine danger everywhere; you can't trust others.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'reckless',
        name: 'Reckless',
        description:
          'You have little regard for your own safety or best interests.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'soft',
        name: 'Soft',
        description:
          'You lose your edge; you become sentimental, passive, gentle.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'unstable',
        name: 'Unstable',
        description:
          'Your emotional state is volatile. You can instantly rage, or fall into despair, act impulsively, or freeze up.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'vicious',
        name: 'Vicious',
        description:
          'You seek out opportunities to hurt people, even for no good reason.',
        quantity: 0,
        maxQuantity: 1
      }
    ];
  }
}

export class Cutter extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Cutter';
    this.characterType = 'Cutter';
    this.characterTypeDescription = 'A dangerous and intimidating fighter';
    this.image = '24fcce82-058a-4ba0-a517-d93167226b7b';

    this.contactsLabel = 'Dangerous Friends';
    this.contacts = [
      {
        id: 'marlane',
        name: 'Marlane',
        description: 'A pugilist',
        attitude: 0
      },
      {
        id: 'chael',
        name: 'Chael',
        description: 'A vicious thug',
        attitude: 0
      },
      {
        id: 'mercy',
        name: 'Mercy',
        description: 'A cold killer',
        attitude: 0
      },
      {
        id: 'grace',
        name: 'Grace',
        description: 'An extortionist',
        attitude: 0
      },
      {
        id: 'sawtooth',
        name: 'Sawtooth',
        description: 'A physicker',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'cutter-battleborn',
        name: 'Battleborn',
        description:
          'You may expend your special armor to reduce harm from an attack in combat or to push yourself during a fight.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-bodyguard',
        name: 'Bodyguard',
        description:
          'When you protect a teammate, take +1d to your resistance roll. When you gather info to anticipate possible threats in the current situation, you get +1 effect.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-ghost-fighter',
        name: 'Ghost Fighter',
        description:
          'You may imbue your hands, melee weapons, or tools with spirit energy. You gain potency in combat vs. the supernatural. You may grapple with spirits to restrain and capture them.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-leader',
        name: 'Leader',
        description:
          "When you Command a cohort in combat, they continue to fight when they would otherwise break (they're not taken out when they suffer level 3 harm). They gain +1 effect and 1 armor.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-mule',
        name: 'Mule',
        description:
          'Your load limits are higher. Light: 5. Normal: 7. Heavy: 8.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-not-to-be-trifled-with',
        name: 'Not to be Trifled With',
        description:
          'You can push yourself to do one of the following: perform a feat of physical force that verges on the superhuman—engage a small gang on equal footing in close combat.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-savage',
        name: 'Savage',
        description:
          "When you unleash physical violence, it's especially frightening. When you Command a frightened target, take +1d.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-vigorous',
        name: 'Vigorous',
        description:
          'You recover from harm faster. Permanently fill in one of your healing clock segments. Take +1d to healing treatment rolls.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cutter-veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const cutterItems: Item[] = [
      {
        id: 'fine-hand-weapon',
        name: 'Fine Hand Weapon',
        description:
          'A finely crafted one-handed melee weapon of your choice. Is this a well-crafted standard weapon, like a perfectly-balanced dagger, or something exotic, like an Iruvian dueling saber or a metal-banded war-club?',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'fine-heavy-weapon',
        name: 'Fine Heavy Weapon',
        description:
          'A finely crafted two-handed melee weapon of your choice. A warhammer, a greatsword, a military pike, a battleaxe, etc. A heavy weapon has more reach and hits harder than a standard weapon. This might give you potency when the power or reach of the weapon is a factor.',
        quantity: 0,
        maxQuantity: 1,
        load: 2
      },
      {
        id: 'scary-weapon-or-tool',
        name: 'Scary Weapon or Tool',
        description:
          'A scary-looking hand weapon or tool. This item grants increased effect when you intimidate, not increased harm in combat.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'manacles-and-chain',
        name: 'Manacles & Chain',
        description:
          'A set of heavy manacles and chain, suitable for restraining a prisoner. A souvenir from a stay with the Bluecoats, perhaps?',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'rage-essence-vial',
        name: 'Rage Essence Vial',
        description:
          'A single dose, which greatly enhances the user’s strength, resistance to pain, and irrational aggression for the span of several minutes. The GM will modify your position and effect accordingly when you fight on rage essence. Also, you suffer two consequences: “Can’t Tell Friend From Foe” and “Can’t Stop Until They’re All Broken.” You may resist these as usual.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      }
    ];

    this.items = this.items.concat(cutterItems);
  }
}

export class Hound extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Hound';
    this.characterType = 'Hound';
    this.characterTypeDescription = 'A deadly sharpshooter and tracker';
    this.image = '06c6e50e-b187-4161-99d4-01228ade7b96';

    this.contactsLabel = 'Deadly Friends';
    this.contacts = [
      {
        id: 'steiner',
        name: 'Steiner',
        description: 'An assassin',
        attitude: 0
      },
      {
        id: 'celene',
        name: 'Celene',
        description: 'A sentinel',
        attitude: 0
      },
      {
        id: 'melvir',
        name: 'Melvir',
        description: 'A physicker',
        attitude: 0
      },
      {
        id: 'veleris',
        name: 'Veleris',
        description: 'A spy',
        attitude: 0
      },
      {
        id: 'casta',
        name: 'Casta',
        description: 'A bounty hunter',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description:
          "You can push yourself to do one of the following: make a ranged attack at extreme distance beyond what's normal for the weapon—unleash a barrage of rapid fire to suppress the enemy.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'focused',
        name: 'Focused',
        description:
          'You may expend your special armor to resist a consequence of surprise or mental harm (fear, confusion, losing track of someone) or to push yourself for ranged combat or tracking.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-hunter',
        name: 'Ghost Hunter',
        description:
          'Your hunting pet is imbued with spirit energy. It gains potency when tracking or fighting the supernatural, and gains an arcane ability: ghost-form, mind-link, or arrow-swift. Take this ability again to choose an additional arcane ability for your pet.',
        quantity: 0,
        maxQuantity: 2
      },
      {
        id: 'scout',
        name: 'Scout',
        description:
          'When you gather info to locate a target, you get +1 effect. When you hide in a prepared position or use camouflage, you get +1d to rolls to avoid detection.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'survivor',
        name: 'Survivor',
        description:
          'From hard won experience or occult ritual, you are immune to the poisonous miasma of the deathlands and are able to subsist on the strange flora and fauna there. You get +1 stress box.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'tough-as-nails',
        name: 'Tough as Nails',
        description:
          'Penalties from harm are one level less severe (though level 4 harm is still fatal).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'vengeful',
        name: 'Vengeful',
        description:
          'You gain an additional xp trigger: You got payback against someone who harmed you or someone you care about. If your crew helped you get payback, also mark crew xp.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const houndItems: Item[] = [
      {
        id: 'fine-pair-of-pistols',
        name: 'Fine Pair of Pistols',
        description:
          'A matched pair of handguns, made for greater accuracy, with double barrels that allow for two shots before reloading. Were your pistols made by Kardera’s Daughters, Templeton & Slane, the Imperial Forge, or some other gunsmith? How do they stand out from the average handgun?',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'fine-long-rifle',
        name: 'Fine Long Rifle',
        description:
          'A finely crafted hunting rifle, deadly at long range, unwieldy in close quarters. Long rifles are usually illegal for private citizens in Doskvol, but you have (real or forged) military paperwork for this one.',
        quantity: 0,
        maxQuantity: 1,
        load: 2
      },
      {
        id: 'electroplasmic-ammunition',
        name: 'Electroplasmic Ammunition',
        description:
          'A bandolier of electroplasmic ammo, especially potent against spirits, but less effective against physical targets. The electrical charge is enough to stun a person, but does very little real harm. Several hits might incapacitate a human target. This ammunition is especially reactive in the ghost field—make a 4-clock called “Attention from the Spirit Wardens” and tick it for every operation in which this ammo was used.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'trained-hunting-pet',
        name: 'A Trained Hunting Pet',
        description:
          'Your animal companion obeys your commands and anticipates your actions. Cohort (Expert: Hunter).',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'spyglass',
        name: 'Spyglass',
        description:
          'A brass tube with lenses that allow long-distance vision. Collapsible. May attach to a rifle.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      }
    ];

    this.items = this.items.concat(houndItems);
  }
}

export class Leech extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Leech';
    this.characterType = 'Leech';
    this.characterTypeDescription = 'A saboteur and technician';
    this.image = '1b7d14f9-73c8-4b89-88a0-db246cd8b8b4';

    this.contactsLabel = 'Clever Friends';
    this.contacts = [
      {
        id: 'stazia',
        name: 'Stazia',
        description: 'An apothecary',
        attitude: 0
      },
      {
        id: 'veldren',
        name: 'Veldren',
        description: 'A psychonaut',
        attitude: 0
      },
      {
        id: 'eckerd',
        name: 'Eckerd',
        description: 'A corpse thief',
        attitude: 0
      },
      {
        id: 'jul',
        name: 'Jul',
        description: 'A blood dealer',
        attitude: 0
      },
      {
        id: 'malista',
        name: 'Malista',
        description: 'A priestess',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'alchemist',
        name: 'Alchemist',
        description:
          'When you invent or craft a creation with alchemical features, take +1 result level to your roll. You begin with one special formula already known.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'analyst',
        name: 'Analyst',
        description:
          'During downtime, you get two ticks to distribute among any long term project clocks that involve investigation or learning a new formula or design plan.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'artificer',
        name: 'Artificer',
        description:
          'When you invent or craft a creation with spark-craft features, take +1 result level to your roll. You begin with one special design already known.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'fortitude',
        name: 'Fortitude',
        description:
          'You may expend your special armor to resist a consequence of fatigue, weakness, or chemical effects, or to push yourself when working with technical skill or handling alchemicals.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-ward',
        name: 'Ghost Ward',
        description:
          'You know how to Wreck an area with arcane substances and methods so it is either anathema or enticing to spirits (your choice).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'physicker',
        name: 'Physicker',
        description:
          'You can Tinker with bones, blood, and bodily humours to treat wounds or stabilize the dying. You may study a malady or corpse. Everyone in your crew gets +1d to their healing treatment rolls.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'saboteur',
        name: 'Saboteur',
        description:
          'When you Wreck, the work is much quieter than it should be and the damage is hidden from casual inspection.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'venomous',
        name: 'Venomous',
        description:
          'Choose a drug or poison (from your bandolier stock) to which you have become immune. You can push yourself to secrete it through your skin or saliva or exhale it as a vapor.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const leechItems: Item[] = [
      {
        id: 'fine-tinkering-tools',
        name: 'Fine Tinkering Tools',
        description:
          'A finely crafted set of tools for detailed mechanist work. A jeweler’s loupe. Measuring devices.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'fine-wrecking-tools',
        name: 'Fine Wrecking Tools',
        description:
          'A specialized set of tools for sabotage and destruction. A small, powerful drill. A mallet and steel spikes. A prybar. An electroplasmic battery, clamps, wire. Vials of acid. A spark-torch cutter and fuel tank.',
        quantity: 0,
        maxQuantity: 1,
        load: 2
      },
      {
        id: 'blowgun-and-darts-syringes',
        name: 'Blowgun & Darts, Syringes',
        description:
          'A small tube and darts that can be filled from alchemy flasks. Empty syringes.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'bandolier',
        name: 'Bandolier',
        description:
          'A strap worn across the body, fitted with specially-padded pouches to hold three alchemical agents or spark-craft bombs. When you employ an alchemical or bomb from a bandolier, choose one from the list at right (or one of your custom-made formulas). During downtime, you automatically refill your bandoliers, so long as you have reasonable access to a supplier or workshop.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'gadgets',
        name: 'Gadgets',
        description:
          'You may create gadgets during downtime by Tinkering with tools and materials. See Gadgets, page 227. Track the load for each gadget you deploy during an operation.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      }
    ];

    this.items = this.items.concat(leechItems);
  }
}

export class Lurk extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Lurk';
    this.characterType = 'Lurk';
    this.characterTypeDescription = 'A stealthy infiltrator and burglar';
    this.image = '9cec5287-f247-47ad-8eab-ed6a3ef82b0f';

    this.contactsLabel = 'Shady Friends';
    this.contacts = [
      {
        id: 'telda',
        name: 'Telda',
        description: 'A beggar',
        attitude: 0
      },
      {
        id: 'darmot',
        name: 'Darmot',
        description: 'A bluecoat',
        attitude: 0
      },
      {
        id: 'frake',
        name: 'Frake',
        description: 'A locksmith',
        attitude: 0
      },
      {
        id: 'roslyn_kellis',
        name: 'Roslyn Kellis',
        description: 'A noble',
        attitude: 0
      },
      {
        id: 'petra',
        name: 'Petra',
        description: 'A city clerk',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'infiltrator',
        name: 'Infiltrator',
        description:
          'You are not affected by quality or Tier when you bypass security measures.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ambush',
        name: 'Ambush',
        description:
          'When you attack from hiding or spring a trap, you get +1d.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'daredevil',
        name: 'Daredevil',
        description:
          'When you roll a desperate action, you get +1d to your roll if you also take -1d to any resistance rolls against consequences from your action.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'devils-footsteps',
        name: "The Devil's Footsteps",
        description:
          'When you push yourself, choose one of the following additional benefits: perform a feat of athletics that verges on the superhuman—maneuver to confuse your enemies so they mistakenly attack each other.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'expertise',
        name: 'Expertise',
        description:
          'Choose one of your action ratings. When you lead a group action using that action, you can suffer only 1 stress at most regardless of the number of failed rolls.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-veil',
        name: 'Ghost Veil',
        description:
          'You may shift partially into the ghost field, becoming shadowy and insubstantial for a few moments. Take 2 stress when you shift, plus 1 stress for each extra feature: It lasts for a few minutes rather than moments—you are invisible rather than shadowy—you may float through the air like a ghost.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'reflexes',
        name: 'Reflexes',
        description:
          "When there's a question about who acts first, the answer is you (two characters with Reflexes act simultaneously).",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'shadow',
        name: 'Shadow',
        description:
          'You may expend your special armor to resist a consequence from detection or security measures, or to push yourself for a feat of athletics or stealth.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const lurkItems: Item[] = [
      {
        id: 'fine-lockpicks',
        name: 'Fine Lockpicks',
        description:
          'A finely crafted set of tools to disable and circumvent locks.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'fine-shadow-cloak',
        name: 'Fine Shadow Cloak',
        description:
          'A hooded cloak made of rare Iruvian shadow-silk that blends into the darkness around it. This item improves your effect level when you sneak around.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'light-climbing-gear',
        name: 'Light Climbing Gear',
        description:
          'A well-crafted set of climbing gear that is less bulky and heavy than a standard set. Standard climbing gear is 2 load.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'silence-potion-vial',
        name: 'Silence Potion Vial',
        description:
          'A vial of golden liquid that negates all sound within 10 paces of the drinker for a span of several moments.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'dark-sight-goggles',
        name: 'Dark-sight Goggles',
        description:
          'An arcane device that allows the wearer to see in pitch darkness as if it were well-lit.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      }
    ];

    this.items = this.items.concat(lurkItems);
  }
}

export class Slide extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Slide';
    this.characterType = 'Slide';
    this.characterTypeDescription = 'A subtle manipulator and spy';
    this.image = '10f1b3a4-b4c3-4755-a66d-17181ba317b2';

    this.contactsLabel = 'Sly Friends';
    this.contacts = [
      {
        id: 'bryl',
        name: 'Bryl',
        description: 'A drug dealer',
        attitude: 0
      },
      {
        id: 'bazso_baz',
        name: 'Bazso Baz',
        description: 'A gang leader',
        attitude: 0
      },
      {
        id: 'klyra',
        name: 'Klyra',
        description: 'A tavern owner',
        attitude: 0
      },
      {
        id: 'nyryx',
        name: 'Nyryx',
        description: 'A prostitute',
        attitude: 0
      },
      {
        id: 'harker',
        name: 'Harker',
        description: 'A jail-bird',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'rooks-gambit',
        name: "Rook's Gambit",
        description:
          'Take 2 stress to roll your best action rating while performing a different action. Say how you adapt your skill to this use.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'cloak-dagger',
        name: 'Cloak & Dagger',
        description:
          'When you use a disguise or other form of covert misdirection, you get +1d to rolls to confuse or deflect suspicion. When you throw off your disguise, the resulting surprise gives you the initiative in the situation.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-voice',
        name: 'Ghost Voice',
        description:
          'You know the secret method to interact with a ghost or demon as if it was a normal human, regardless of how wild or feral it appears. You gain potency when communicating with the supernatural.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'like-looking-into-a-mirror',
        name: 'Like Looking into a Mirror',
        description: 'You can always tell when someone is lying to you.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'a-little-something-on-the-side',
        name: 'A Little Something on the Side',
        description: 'At the end of each downtime phase, you earn +2 stash.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'mesmerism',
        name: 'Mesmerism',
        description:
          "When you Sway someone, you may cause them to forget that it's happened until they next interact with you.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'subterfuge',
        name: 'Subterfuge',
        description:
          'You may expend your special armor to resist a consequence from suspicion or persuasion, or to push yourself for subterfuge.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'trust-in-me',
        name: 'Trust in Me',
        description:
          'You get +1d vs. a target with whom you have an intimate relationship.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const slideItems: Item[] = [
      {
        id: 'fine-clothes-and-jewelry',
        name: 'Fine Clothes & Jewelry',
        description:
          'An outfit that appears to be of such fine make as to pass you off as a wealthy noble. If you’re carrying this item as a second outfit to change into, it counts as 2 load.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'fine-disguise-kit',
        name: 'Fine Disguise Kit',
        description:
          'A theatrical make-up kit equipped with an impressive array of expert appliances to fool the eye. The fine quality of this kit may increase the effect of your deceptive actions when you use it.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'fine-loaded-dice-trick-cards',
        name: 'Fine Loaded Dice, Trick Cards',
        description:
          'Gambling accouterments subtly altered to favor particular outcomes. The fine quality of this kit may increase the effect of your deceptive actions when you use it.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'trance-powder',
        name: 'Trance Powder',
        description:
          'A dose of the popular drug, which induces an altered mental state. The victim of this powder is not fully unconscious, but rather retreats into a calm, suggestible mental state, similar to hypnotism.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'cane-sword',
        name: 'Cane-Sword',
        description:
          'A slim sword and its sheath, disguised as a noble’s cane. The disguise will fool a cursory inspection.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      }
    ];

    this.items = this.items.concat(slideItems);
  }
}

export class Spider extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Spider';
    this.characterType = 'Spider';
    this.characterTypeDescription = 'A devious mastermind';
    this.image = '1f6e47b6-c3c6-47b9-8b19-e553e6362de2';

    this.contactsLabel = 'Shrewd Friends';
    this.contacts = [
      {
        id: 'salia',
        name: 'Salia',
        description: 'An information broker',
        attitude: 0
      },
      {
        id: 'augus',
        name: 'Augus',
        description: 'A master architect',
        attitude: 0
      },
      {
        id: 'jennah',
        name: 'Jennah',
        description: 'A servant',
        attitude: 0
      },
      {
        id: 'riven',
        name: 'Riven',
        description: 'A chemist',
        attitude: 0
      },
      {
        id: 'jeren',
        name: 'Jeren',
        description: 'A bluecoat archivist',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'foresight',
        name: 'Foresight',
        description:
          'Two times per score you can assist a teammate without paying stress. Tell us how you prepared for this.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'calculating',
        name: 'Calculating',
        description:
          'Due to your careful planning, during downtime, you may give yourself or another crew member +1 downtime action.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'connected',
        name: 'Connected',
        description:
          'During downtime, you get +1 result level when you acquire an asset or reduce heat.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'functioning-vice',
        name: 'Functioning Vice',
        description:
          'When you indulge your vice, you may adjust the dice outcome by 1 or 2 (up or down). An ally who joins in your vice may do the same.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-contract',
        name: 'Ghost Contract',
        description:
          "When you shake on a deal, you and your partner—human or otherwise—both bear a mark of your oath. If either breaks the contract, they take level 3 harm, 'Cursed'.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'jail-bird',
        name: 'Jail Bird',
        description:
          'When incarcerated, your wanted level counts as 1 less, your Tier as 1 more, and you gain +1 faction status with a faction you help on the inside (in addition to your incarceration roll).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'mastermind',
        name: 'Mastermind',
        description:
          'You may expend your special armor to protect a teammate, or to push yourself when you gather information or work on a long-term project.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'weaving-the-web',
        name: 'Weaving the Web',
        description:
          'You gain +1d to Consort when you gather information on a target for a score. You get +1d to the engagement roll for that operation.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const spiderItems: Item[] = [
      {
        id: 'fine-cover-identity',
        name: 'Fine Cover Identity',
        description:
          'Paperwork, planted stories and rumors, and false relationships sufficient to pass as a different person.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'fine-bottle-of-whiskey',
        name: 'Fine Bottle of Whiskey',
        description:
          'A rare distillation from your personal collection, potent both in its alcohol and its ability to impress.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'blueprints',
        name: 'Blueprints',
        description:
          'A folio of useful architectural drawings and city plans. Feel free to specify which plans you’re carrying when you choose this item.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'vial-of-slumber-essence',
        name: 'Vial of Slumber Essence',
        description:
          'A dose of slumber essence sufficient to put someone to sleep for an hour. The victim’s sleep isn’t supernatural, but it is deep—they can be roused with some effort.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'concealed-palm-pistol',
        name: 'Concealed Palm Pistol',
        description:
          'A small firearm with a weak charge, easily concealed in a sleeve or waistcoat. This pistol has extremely limited range; only a few feet. It’s very difficult to detect on your person, even if you’re searched.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      }
    ];

    this.items = this.items.concat(spiderItems);
  }
}

export class Whisper extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Whisper';
    this.characterType = 'Whisper';
    this.characterTypeDescription = 'An arcane adept and channeler';
    this.image = '88a1879b-06a3-4632-897b-e0cd7e423c46';

    this.contactsLabel = 'Strange Friends';
    this.contacts = [
      {
        id: 'nyryx',
        name: 'Nyryx',
        description: 'A possessor ghost',
        attitude: 0
      },
      {
        id: 'scurlock',
        name: 'Scurlock',
        description: 'A vampire',
        attitude: 0
      },
      {
        id: 'setarra',
        name: 'Setarra',
        description: 'A demon',
        attitude: 0
      },
      {
        id: 'quellyn',
        name: 'Quellyn',
        description: 'A witch',
        attitude: 0
      },
      {
        id: 'flint',
        name: 'Flint',
        description: 'A spirit trafficker',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'compel',
        name: 'Compel',
        description:
          'You can Attune to the ghost field to force a nearby ghost to appear and obey a command you give it. You are not supernaturally terrified by a ghost you summon or compel (though your allies may be).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ghost-mind',
        name: 'Ghost Mind',
        description:
          "You're always aware of supernatural entities in your presence. Take +1d when you gather info about the supernatural.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'iron-will',
        name: 'Iron Will',
        description:
          "You're immune to the terror that some supernatural entities inflict on sight. Take +1d to resistance rolls with Resolve.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'occultist',
        name: 'Occultist',
        description:
          "You know the secret ways to Consort with ancient powers, forgotten gods or demons. Once you've consorted with one, you get +1d to command cultists who worship it.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'ritual',
        name: 'Ritual',
        description:
          'You can Study an occult ritual (or create a new one) to summon a supernatural effect or being. You know the arcane methods to perform ritual sorcery. You begin with one ritual already learned.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'strange-methods',
        name: 'Strange Methods',
        description:
          'When you invent or craft a creation with arcane features, take +1 result level to your roll. You begin with one arcane design already known.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'tempest',
        name: 'Tempest',
        description:
          'You can push yourself to do one of the following: unleash a stroke of lightning as a weapon—summon a storm in your immediate vicinity (torrential rain, roaring winds, heavy fog, chilling frost/snow, etc.).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'warded',
        name: 'Warded',
        description:
          'You may expend your special armor to resist a supernatural consequence, or to push yourself when you deal with arcane forces.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const whisperItems: Item[] = [
      {
        id: 'fine-lightning-hook',
        name: 'Fine Lightning Hook',
        description:
          'A long, two-handed pole with a loop of heavy wire at the end, connected to an electroplasmic capacitor. Suitable for grappling a spirit and dragging it into a spirit bottle. This custom-made hook collapses into a compact form, thus reducing its load to 1, even though it’s two-handed.',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'fine-spirit-mask',
        name: 'Fine Spirit Mask',
        description:
          'An arcane item that allows the trained user to see supernatural energies in great detail. Also affords some measure of protection against ghostly possession. Each spirit mask is unique. What does yours look like? What makes it strange and disturbing to see?',
        quantity: 0,
        maxQuantity: 1,
        load: 1
      },
      {
        id: 'spirit-bottles',
        name: 'Spirit Bottles (2)',
        description:
          'An arcane device used to trap a spirit. A metal and crystalline cylinder, the size of a loaf of bread.',
        quantity: 0,
        maxQuantity: 2,
        load: 1
      },
      {
        id: 'ghost-key',
        name: 'Ghost Key',
        description:
          'An arcane device that can open ghost doors. There’s an echo of the entire city, across the ages, trapped in the ghost field. Sometimes a door to that place can be found.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      },
      {
        id: 'demonbane-charm',
        name: 'Demonbane Charm',
        description: 'An arcane trinket that demons prefer to avoid.',
        quantity: 0,
        maxQuantity: 1,
        load: 0
      }
    ];

    this.items = this.items.concat(whisperItems);
  }
}

export class Ghost extends Character {
  constructor() {
    super();
    this.name = 'Unnamed Ghost';
    this.characterType = 'Ghost';
    this.characterTypeDescription = 'A spirit without a body';
    this.image = '9f5d267b-83f1-40e5-9ff6-04d1c92a3d21';

    this.specialAbilities = [
      {
        id: 'ghost-form',
        name: 'Ghost Form',
        description:
          "You are now a concentration of electroplasmic vapor which resembles your living body and clothes. You may weakly interact with the physical world and vice versa. You're vulnerable to arcane powers and electroplasmic effects. You move about by floating and may fly swiftly without tiring. You may slowly flow through small openings as a vapor. You chill the area around you and are terrifying for the living to behold. You are affected by spiritbane charms (take 2 drain to overcome the repulsion). Whenever you would take stress, take drain instead. When you would take trauma, take gloom instead.",
        quantity: 1,
        maxQuantity: 1
      },
      {
        id: 'dissipate',
        name: 'Dissipate',
        description:
          'You can disperse the electroplasmic vapor of your ghostly form in order to pass through solid objects for a moment. Take 1 drain when you dissipate, plus 1 drain for each feature: It lasts longer (a minute—an hour—a day)—you also become invisible—anything that passes through your form becomes dangerously electrified or frozen.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'manifest',
        name: 'Manifest',
        description:
          'Take 1 drain to flow through the electroplasmic pathways of the ghost field in order to instantly travel to any place you knew intimately in life, or to answer the summoning call of a compel.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'poltergeist',
        name: 'Poltergeist',
        description:
          'Take 1 drain to strongly interact with the physical world for a few moments (as if you had a normal body). Extend the reach and magnitude of your interaction to include telekinetic force and electroplasmic discharges by taking more drain (2-6).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'possess',
        name: 'Possess',
        description:
          "You may attune to the ghost field in order to take control of a living body. When your control is challenged, you must re-attune (risking electroplasmic harm) or leave the body. Your control is challenged when: you consume spirit energy from the host—when arcane powers act against you—when the host's will is driven to desperation. You may easily and indefinitely possess a hull or hollow which has been ritually prepared for you (change your playbook to Hull or Vampire, respectively).",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 4
      }
    ];
  }
}

export class Hull extends Character {
  frameFeatures: Effectable[] = [
    {
      id: 'frame-feature-interior-chamber',
      name: 'Interior Chamber',
      description: 'You have a compartment for a passenger or operator.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-life-like-appearance',
      name: 'Life-Like Appearance',
      description:
        'You are masterfully crafted to pass for a living being (unless it is closely scrutinized).',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-levitation',
      name: 'Levitation',
      description:
        'You can fly slowly by floating inside a volatile electroplasmic bubble.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-phonograph',
      name: 'Phonograph',
      description: 'A wax-cylinder recording and playback device.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-plating',
      name: 'Plating',
      description: 'Thick metal armor plates.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-reflexes',
      name: 'Reflexes',
      description:
        'You have lightning-fast reaction time (as the Lurk ability).',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-sensors',
      name: 'Sensors',
      description:
        "Your sensorium includes sonar which can 'see' through walls and hear heartbeats.",
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-smoke-projectors',
      name: 'Smoke Projectors',
      description:
        'Chemical system that can exude a dark, acrid cloud of smoke—enough to fill a large room.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-spider-climb',
      name: 'Spider Climb',
      description:
        'Miniature barbs built into your frame allow it to walk and climb effortlessly on walls and ceilings.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'frame-feature-spring-leap-pistons',
      name: 'Spring-Leap Pistons',
      description:
        'You can jump to extreme heights (several stories) and survive falls without damage.',
      quantity: 0,
      maxQuantity: 1
    }
  ];

  constructor() {
    super();
    this.name = 'Unnamed Hull';
    this.characterType = 'Hull';
    this.characterTypeDescription = 'A spirit animating a clockwork frame';
    this.image = 'aa5271f0-4d79-4ae7-9348-8bbeae94a27f';

    this.specialAbilities = [
      {
        id: 'automaton',
        name: 'Automaton',
        description:
          "You are a spirit animating a clockwork body. You have human-like strength and senses, by default. Your hull has natural armor (this doesn't count for your load). Your former human feelings, interests, and connections are only dim memories. You now exist to fulfill your functions. Choose three (at left). You may be rebuilt if damaged or destroyed. If your soul vessel is shattered, you are freed from servitude and become a Ghost. Whenever you would take stress, take drain instead.",
        quantity: 1,
        maxQuantity: 1
      },
      {
        id: 'overcharge',
        name: 'Overcharge',
        description:
          'Take 1 drain to perform a feat of extreme strength or speed (run faster than a horse, rend metal with bare hands, etc.). This factors into effect.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'compartments',
        name: 'Compartments',
        description:
          'Your items are built-in to your frame and may recess beneath panels out of sight. Your frame can now carry +2 load.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'electroplasmic-projectors',
        name: 'Electroplasmic Projectors',
        description:
          'You may release some of your plasmic energy as an electrical shock around you or as a directed beam. You may also use this ability to create a lightning barrier to repel or trap a spirit. Take 1 drain for each level of magnitude.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'interface',
        name: 'Interface',
        description:
          'You may attune to the local electroplasmic power field to control it or something connected to it (including another hull).',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'secondary-hull',
        name: 'Secondary Hull',
        description:
          'Choose an additional frame and its starting feature. You may transfer your consciousness between your frames at will.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'frame-upgrade',
        name: 'Frame Upgrade',
        description: 'Choose an additional frame feature.',
        quantity: 0,
        maxQuantity: 4
      }
    ];
  }
}

export class Vampire extends Character {
  strictures: Effectable[] = [
    {
      id: 'slumber',
      name: 'Slumber',
      description:
        'In downtime, you must spend one activity resting in a dark, silent place (or else suffer 3 stress).',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'forbidden',
      name: 'Forbidden',
      description:
        'You cannot enter a private residence without permission from the owner.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'repelled',
      name: 'Repelled',
      description:
        'Spiritbane charms can hold you at bay. Take 2 stress to resist the repulsion.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'bestial',
      name: 'Bestial',
      description:
        'When you suffer physical harm or overindulge your vice, your body twists into a horrific bestial form until you next feed without overindulging.',
      quantity: 0,
      maxQuantity: 1
    },
    {
      id: 'bound',
      name: 'Bound',
      description: 'Your spirit must remain in this body, or be destroyed.',
      quantity: 0,
      maxQuantity: 1
    }
  ];

  constructor() {
    super();
    this.name = 'Unnamed Vampire';
    this.characterType = 'Vampire';
    this.characterTypeDescription = 'A spirit animating an undead body';
    this.image = '9cec5287-f247-47ad-8eab-ed6a3ef82b0f';

    this.maxPlaybookXP = 10;
    this.maxInsightXP = 8;
    this.maxProwessXP = 8;
    this.maxResolveXP = 8;

    this.maxStress = 12;

    this.contactsLabel = 'Dark Servants';
    this.contacts = [
      {
        id: 'rutherford',
        name: 'Rutherford',
        description: 'A butler',
        attitude: 0
      },
      {
        id: 'lylandra',
        name: 'Lylandra',
        description: 'A consort',
        attitude: 0
      },
      {
        id: 'kira',
        name: 'Kira',
        description: 'A bodyguard',
        attitude: 0
      },
      {
        id: 'otto',
        name: 'Otto',
        description: 'A coachman',
        attitude: 0
      },
      {
        id: 'edrik',
        name: 'Edrik',
        description: 'An envoy',
        attitude: 0
      }
    ];

    this.specialAbilities = [
      {
        id: 'undead',
        name: 'Undead',
        description:
          "You are a spirit which animates an undead body. Your trauma is maxed out. Choose four trauma conditions which reflect your vampiric nature. Arcane attacks are potent against you. If you suffer fatal harm or trauma, your undead spirit is overwhelmed. You take level 3 harm: 'Incapacitated' until you feed enough to recover. If you suffer arcane harm while in this state, you are destroyed utterly. Your XP tracks are longer (you now advance more slowly). You have more stress boxes.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'terrible-power',
        name: 'Terrible Power',
        description:
          'Take 1 stress to perform a feat of superhuman strength or speed (run faster than a carriage, break stone with bare hands, leap onto the roof of a building, etc.). This factors into effect.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'arcane-sight',
        name: 'Arcane Sight',
        description:
          "Take 1 stress to sense beyond human limits. 'Hear' a subject's true thoughts or feelings, see in pitch darkness, sense the presence of invisible things, intuit the location of a hidden object, etc.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'void-in-the-echo',
        name: 'A Void in the Echo',
        description:
          'You are invisible to spirits and may not be harmed by them. Take 2 stress to cause living things to avert their gaze and fail to observe you for a few moments.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'dark-talent',
        name: 'Dark Talent',
        description:
          "Choose Insight, Prowess, or Resolve. Your max rating for actions under that attribute becomes 5. When you take this ability, add +1 dot to the resistance rating of the attribute you've chosen.",
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'sinister-guile',
        name: 'Sinister Guile',
        description:
          'During downtime, choose one: Get a free additional downtime activity, or take +1d to all downtime activity rolls.',
        quantity: 0,
        maxQuantity: 1
      },
      {
        id: 'veteran',
        name: 'Veteran',
        description: 'Choose a special ability from another source.',
        quantity: 0,
        maxQuantity: 3
      }
    ];

    const vampireItems: Item[] = []; // todo
    this.items = this.items.concat(vampireItems);
  }
}

export function createCharacterTemplates() {
  return {
    cutter: new Cutter(),
    hound: new Hound(),
    leech: new Leech(),
    lurk: new Lurk(),
    slide: new Slide(),
    spider: new Spider(),
    whisper: new Whisper(),
    ghost: new Ghost(),
    hull: new Hull(),
    vampire: new Vampire()
  };
}
