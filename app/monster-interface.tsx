export interface IMonster {
    index: string;
    name: string;
    size: "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";
    type: string;
    alignment: string;
    armor_class: ArmorClass[];
    hit_points: number;
    hit_dice: string;
    hit_points_roll: string;
    speed: Speed;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma:number;
    proficiencies: ProficiencyElement[];
    damage_vulnerabilities: any[];
    damage_resistances: any[];
    damage_immunities: string[];
    condition_immunities: any[];
    senses: Senses;
    languages: string;
    challenge_rating: number;
    proficiency_bonus: number;
    xp: number;
    special_abilities: SpecialAbility[];
    actions: MonsterAction[];
    legendary_actions: LegendaryAction[];
    image: string;
    url: string;
}

export interface MonsterAction {
    name: string;
    multiattack_type?: string;
    desc: string;
    actions: ActionAction[];
    attack_bonus?: number;
    damage?: Damage[];
    dc?: Dc;
    usage?: ActionUsage;
}

export interface ActionAction {
    action_name: string;
    count: number;
    type: string;
}

export interface Damage {
    damage_type: DcTypeClass;
    damage_dice: string;
}

export interface DcTypeClass {
    index: string;
    name: string;
    url: string;
}

export interface Dc {
    dc_type: DcTypeClass;
    dc_value: number;
    success_type: string;
}

export interface ActionUsage {
    type: string;
    dice: string;
    min_value: number;
}

export interface ArmorClass {
    type: string;
    value: number;
}


export interface LegendaryAction {
    name: string;
    desc: string;
    dc?: Dc;
    damage?: Damage[];
}

export interface ProficiencyElement {
    value: number;
    proficiency: DcTypeClass;
}

export interface Senses {
    blindsight?: string;
    darkvision?: string;
    passive_perception?: number;
}

export interface SpecialAbility {
    name: string;
    desc: string;
    usage?: SpecialAbilityUsage;
}

export interface SpecialAbilityUsage {
    type: string;
    times: number;
    rest_types: any[];
}

export interface Speed {
    walk?: string;
    fly?: string;
    swim?: string;
    climb?: string;
}