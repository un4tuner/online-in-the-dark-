<template>
  <div class="sheet-layout__nested">
    <div
      class="character-layout"
      ref="carouselRef"
      @scroll="updateCurrentIndex($event.target as HTMLElement)"
    >
      <div>
        <section>
          <!-- Title card -->
          <div
            class="character-type-card"
            :style="{
              backgroundColor: getSheetImage(sheet.image)?.commonColor
            }"
          >
            <img :src="getSheetImage(sheet.image)?.url" />
            <h1
              :class="{
                'extra-long': sheet.name
                  .split(' ')
                  .some((str) => str.length > 8)
              }"
            >
              {{ sheet.name }}
            </h1>
            <h2>
              {{ sheet.characterTypeDescription }}
            </h2>
          </div>

          <!-- Name -->
          <div class="input-group name">
            <label for="character-name">Name</label>
            <div class="row flat">
              <input
                id="character-name"
                type="text"
                :value="props.sheet.name"
                @focus="focus = 'name'"
                :placeholder="'Unnamed ' + sheet.characterType"
                @change="
                  changeValue(
                    ($event.target as HTMLInputElement)?.value,
                    'name'
                  )
                "
              />
              <button class="btn btn--icon" @click="randomizeName">
                <i class="fas fa-random"></i>
              </button>
            </div>
            <CollapsingShelf :show="focus == 'name'">
              <p>What's your name?</p>
            </CollapsingShelf>
          </div>

          <!-- Alias -->
          <div class="input-group">
            <label for="character-alias"
              >Alias
              <label class="muted">(Optional)</label>
            </label>
            <div class="row flat">
              <input
                id="character-alias"
                type="text"
                :value="props.sheet.alias"
                @focus="focus = 'alias'"
                :placeholder="'Alias'"
                @change="
                  changeValue(
                    ($event.target as HTMLInputElement)?.value,
                    'alias'
                  )
                "
              />
              <button class="btn btn--icon" @click="randomizeAlias">
                <i class="fas fa-random"></i>
              </button>
            </div>

            <CollapsingShelf :show="focus == 'alias'">
              <p>What alias or nickname are you known by in the underworld?</p>
            </CollapsingShelf>
          </div>

          <!-- Heritage -->
          <div class="input-group">
            <label for="character-heritage">Heritage</label>
            <input
              id="character-heritage"
              type="text"
              :value="props.sheet.heritage"
              @focus="focus = 'heritage'"
              :placeholder="'Heritage'"
              @change="
                changeValue(
                  ($event.target as HTMLInputElement)?.value,
                  'heritage'
                )
              "
            />
            <CollapsingShelf :show="focus == 'heritage'">
              <p>You can trace your family line back to this place.</p>
              <div class="text-list">
                <button
                  class="btn btn--text"
                  v-for="location in codex.lexicon.locations"
                  :key="location.name"
                  @mousedown="
                    changeValue(location.name, 'heritage');
                    changeValue(location.blurb, 'heritageDescription');
                  "
                >
                  {{ location.name }}
                </button>
              </div>
            </CollapsingShelf>
            <textarea
              spellcheck="false"
              :value="props.sheet.heritageDescription"
              @focus="focus = 'heritageDescription'"
              @change="
                changeValue(
                  ($event.target as HTMLTextAreaElement)?.value,
                  'heritageDescription'
                )
              "
              placeholder="A detail about your family life or upbringing."
            ></textarea>
            <CollapsingShelf :show="focus == 'heritageDescription'">
              <p>Add a detail about your family life or upbringing.</p>
            </CollapsingShelf>
          </div>

          <!-- Look -->
          <div class="input-group">
            <label for="character-look">Look</label>
            <textarea
              id="character-look"
              type="text"
              :value="props.sheet.look"
              @focus="focus = 'look'"
              :placeholder="`A plain-looking ${sheet.characterType}${
                sheet.heritage ? ` from ${sheet.heritage}` : ''
              }`"
              @change="
                changeValue(($event.target as HTMLInputElement)?.value, 'look')
              "
            ></textarea>
            <CollapsingShelf :show="focus == 'look'">
              <p>What do you look like?</p>
              <div class="text-list">
                <label>Descriptions</label>
                <button
                  class="btn btn--text"
                  v-for="look in codex.looks?.adjectives"
                  :key="look"
                  @click="
                    changeValue(
                      sheet.look.length
                        ? sheet.look + ', ' + look.toLowerCase()
                        : look,
                      'look'
                    )
                  "
                >
                  {{ look }}
                </button>
              </div>
              <div class="text-list">
                <label>Clothes</label>
                <button
                  class="btn btn--text"
                  v-for="look in codex.looks?.clothes"
                  :key="look"
                  @click="
                    changeValue(
                      sheet.look.length
                        ? sheet.look + ', ' + look.toLowerCase()
                        : look,
                      'look'
                    )
                  "
                >
                  {{ look }}
                </button>
              </div>
            </CollapsingShelf>
          </div>

          <!-- Background -->
          <div class="input-group">
            <label for="character-background">Background</label>
            <input
              id="character-background"
              type="text"
              :value="props.sheet.background"
              @focus="focus = 'background'"
              :placeholder="'Background'"
              @change="
                changeValue(
                  ($event.target as HTMLInputElement)?.value,
                  'background'
                )
              "
            />
            <CollapsingShelf :show="focus == 'background'">
              <p>What did you do before you joined the crew?</p>
              <div class="text-list">
                <button
                  class="btn btn--text"
                  v-for="background in codex.sheets?.character?.backgrounds"
                  :key="background.name"
                  @mousedown="
                    changeValue(background.name, 'background');
                    changeValue(background.blurb, 'backgroundDescription');
                  "
                >
                  {{ background.name }}
                </button>
              </div>
            </CollapsingShelf>
          </div>
          <div class="input-group">
            <textarea
              spellcheck="false"
              :value="props.sheet.backgroundDescription"
              @focus="focus = 'backgroundDescription'"
              @change="
                changeValue(
                  ($event.target as HTMLTextAreaElement)?.value,
                  'backgroundDescription'
                )
              "
              placeholder="E.g. Sailor, mutineer, former Bluecoat, smuggler, courtier, street urchin, gang member, etc."
            ></textarea>
            <CollapsingShelf :show="focus == 'backgroundDescription'">
              <p>Add a detail about your past life or career.</p>
            </CollapsingShelf>
          </div>

          <!-- Crew -->
          <div class="input-group">
            <label>Crew</label>
            <div class="row wrap">
              <button
                class="btn btn--tab mobile-full-width"
                @click="changeValue(null, 'crewId')"
                :class="{ active: sheet.crewId === null }"
              >
                None
              </button>
              <button
                class="btn btn--tab mobile-full-width"
                v-for="crew in crewSheets"
                :key="crew.id"
                :class="{ active: sheet.crewId === crew.id }"
                @click="changeValue(crew.id, 'crewId')"
              >
                {{ crew.name }}
              </button>
            </div>
          </div>
        </section>

        <Divider />

        <section>
          <!-- Vice -->
          <div class="input-group">
            <label for="character-vice">Vice</label>
            <input
              id="character-vice"
              type="text"
              :value="props.sheet.vice"
              @focus="focus = 'vice'"
              :placeholder="'Vice'"
              @change="
                changeValue(($event.target as HTMLInputElement)?.value, 'vice')
              "
            />

            <CollapsingShelf :show="focus == 'vice'">
              <p>What vice do you indulge in to relieve stress?</p>
              <div class="text-list">
                <button
                  class="btn btn--text"
                  v-for="vice in codex.sheets?.character?.vices"
                  :key="vice.name"
                  @click="
                    changeValue(vice.name, 'vice');
                    changeValue(vice.blurb, 'viceDescription');
                  "
                >
                  {{ vice.name }}
                </button>
              </div>
            </CollapsingShelf>
          </div>

          <!-- Vice Description -->
          <div class="input-group">
            <textarea
              spellcheck="false"
              :value="props.sheet.viceDescription"
              @focus="focus = 'viceDescription'"
              @change="
                changeValue(
                  ($event.target as HTMLTextAreaElement)?.value,
                  'viceDescription'
                )
              "
              placeholder="Add a detail about your vice."
            ></textarea>
            <CollapsingShelf :show="focus == 'viceDescription'">
              <p>Add a detail about your Vice.</p>
            </CollapsingShelf>
          </div>

          <!-- Vice Purveyor -->
          <div class="input-group">
            <label for="character-vice-purveyor">Vice Purveyor</label>
            <textarea
              id="character-vice-purveyor"
              type="text"
              :value="props.sheet.vicePurveyor"
              spellcheck="false"
              @focus="focus = 'vicePurveyor'"
              :placeholder="'Vice Purveyor'"
              @change="
                changeValue(
                  ($event.target as HTMLInputElement)?.value,
                  'vicePurveyor'
                )
              "
            ></textarea>
            <CollapsingShelf :show="focus == 'vicePurveyor'">
              <p>Who provides your vice?</p>
              <div class="text-list" v-if="vicePurveyors.length">
                <button
                  class="btn btn--text"
                  v-for="purveyor in vicePurveyors"
                  :key="purveyor"
                  @click="
                    changeValue(
                      `${purveyor.name}. ${purveyor.blurb}`,
                      'vicePurveyor'
                    )
                  "
                >
                  {{ purveyor.name }}
                </button>
              </div>
            </CollapsingShelf>
          </div>
        </section>
        <Divider />
        <section>
          <!-- Contacts -->
          <label for="contacts"> {{ sheet.contactsLabel }} </label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditPersonModal, {
                  propertyName: 'Person',
                  idPrefix: 'contact',
                  onCreateNew: onCreateContact
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedContacts"
              label="Show only selected"
            />
          </div>
          <div class="tile-list tile-list--mini" v-if="contacts.length > 0">
            <PersonTile
              v-for="contact in contacts"
              :key="contact.id"
              :idPrefix="props.sheet.characterType + '-contact'"
              :propertyName="sheet.contactsLabel"
              :person="contact"
              :change="onChangeContact"
              :onEdit="onEditContact"
              :onDelete="onDeleteContact"
              :options="[
                { value: -1, icon: 'fas fa-thumbs-down' },
                { value: 1, icon: 'fas fa-thumbs-up' }
              ]"
            />
          </div>
          <p v-if="contacts.length == 0" class="no-tiles">
            <em>❖ No {{ sheet.contactsLabel }}</em>
          </p>
        </section>
      </div>
      <div>
        <section>
          <!-- Stress -->
          <div class="input-group">
            <label for="stress">
              Stress
              <label class="muted">
                {{ sheet.stress }} / {{ maxStress }}
              </label>
            </label>
            <CheckboxBar
              id="stress"
              :value="props.sheet.stress"
              :max="props.sheet.maxStress"
              @change="changeValue($event, 'stress')"
            />
          </div>

          <!-- Traumas -->
          <div class="input-group">
            <label for="trauma"
              >Trauma
              <label class="muted">
                {{ traumas.filter((t) => t.quantity > 0).length }} /
                {{ maxTraumas }}
              </label>
            </label>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedTraumas"
              label="Show only selected"
            />
            <div class="tile-list" v-if="traumas.length > 0">
              <EffectableTile
                v-for="trauma in traumas"
                :key="trauma.id"
                :effectable="trauma"
                idPrefix="trauma"
                :propertyName="'Trauma'"
                :change="(quantity: number) => onChangeTrauma(trauma, quantity)"
              />
            </div>
            <p v-if="traumas.length == 0" class="no-tiles">
              <em>❖ No Traumas</em>
            </p>
          </div>
        </section>
        <Divider />
        <section>
          <label>Harms</label>
          <div class="harms-list">
            <!-- Level 3 Harm -->
            <HarmTile
              :key="0"
              :harm="sheet.harms[0]"
              :changeHarm="(newDescription: string) => changeHarm(0, newDescription)"
            />

            <p v-if="!sheet.harms[0].description.length">Severe Harm</p>
            <p class="harm" v-else v-html="'Need help'"></p>

            <!-- Level 2 Harm -->
            <HarmTile
              :key="1"
              :harm="sheet.harms[1]"
              :changeHarm="(newDescription: string) => changeHarm(1, newDescription)"
            />
            <HarmTile
              :key="2"
              :harm="sheet.harms[2]"
              :changeHarm="(newDescription: string) => changeHarm(2, newDescription)"
            />

            <p
              v-if="
                !sheet.harms[1].description.length &&
                !sheet.harms[2].description.length
              "
            >
              Moderate Harm
            </p>
            <p class="harm" v-else v-html="text('[/dice -1]')"></p>

            <!-- Level 1 Harm -->
            <HarmTile
              :key="3"
              :harm="sheet.harms[3]"
              :changeHarm="(newDescription: string) => changeHarm(3, newDescription)"
            />
            <HarmTile
              :key="4"
              :harm="sheet.harms[4]"
              :changeHarm="(newDescription: string) => changeHarm(4, newDescription)"
            />

            <p
              v-if="
                !sheet.harms[3].description.length &&
                !sheet.harms[4].description.length
              "
            >
              Lesser Harm
            </p>
            <p class="harm" v-else v-html="text('Less Effect')"></p>
          </div>
          <label> Healing </label>
          <Clock
            :clock="sheet.healingClock"
            :change="((value: number) => changeValue(value, 'healingClock/value'))"
          />

          <label> Armors </label>
          <Checkbox
            icon="fa-shield-alt"
            v-model="sheet.armorUsed"
            label="Armor"
            @update:modelValue="changeValue($event, 'armorUsed')"
          />
          <Checkbox
            icon="fa-shield-alt"
            v-model="sheet.heavyArmorUsed"
            label="Heavy"
            @update:modelValue="changeValue($event, 'heavyArmorUsed')"
          />
          <Checkbox
            icon="fa-shield-alt"
            v-model="sheet.specialArmorUsed"
            label="Special"
            @update:modelValue="changeValue($event, 'specialArmorUsed')"
          />
        </section>
        <Divider />
        <section>
          <label>Playbook</label>
          <CheckboxBar
            :value="props.sheet.playbookXP"
            :max="8"
            @change="changeValue($event, 'playbookXP')"
          />
          <label>Special Abilities</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Special Ability',
                  idPrefix: sheet.characterType,
                  onCreateNew: onCreateAbility
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedAbilities"
              label="Show only selected"
            />
          </div>
          <div class="tile-list">
            <EffectableTile
              v-for="ability in specialAbilities"
              :key="ability.id"
              :effectable="ability"
              :propertyName="'Special Ability'"
              :idPrefix="props.sheet.characterType"
              :change="(quantity: number) => onChangeAbility(ability, quantity)"
              :onEdit="onEditAbility"
              :onDelete="onDeleteAbility"
            />
          </div>
        </section>
        <Divider />
        <section>
          <label
            >Insight
            <label class="muted">({{ insight }})</label>
          </label>
          <CheckboxBar
            :value="props.sheet.insightXP"
            :max="6"
            @change="changeValue($event, 'insightXP')"
          />
          <div class="attribute-list">
            <AttributeTile
              :effectable="sheet.attrHunt"
              :change="(quantity: number) => changeValue(quantity, 'attrHunt/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrStudy"
              :change="(quantity: number) => changeValue(quantity, 'attrStudy/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrSurvey"
              :change="(quantity: number) => changeValue(quantity, 'attrSurvey/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrTinker"
              :change="(quantity: number) => changeValue(quantity, 'attrTinker/quantity')"
            />
          </div>
        </section>
        <Divider />
        <section>
          <label
            >Prowess
            <label class="muted">({{ prowess }})</label>
          </label>
          <CheckboxBar
            :value="props.sheet.prowessXP"
            :max="6"
            @change="changeValue($event, 'prowessXP')"
          />
          <div class="attribute-list">
            <AttributeTile
              :effectable="sheet.attrFinesse"
              :change="(quantity: number) => changeValue(quantity, 'attrFinesse/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrProwl"
              :change="(quantity: number) => changeValue(quantity, 'attrProwl/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrSkirmish"
              :change="(quantity: number) => changeValue(quantity, 'attrSkirmish/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrWreck"
              :change="(quantity: number) => changeValue(quantity, 'attrWreck/quantity')"
            />
          </div>
        </section>
        <Divider />
        <section>
          <label
            >Resolve
            <label class="muted">({{ resolve }})</label>
          </label>
          <CheckboxBar
            :value="props.sheet.resolveXP"
            :max="6"
            @change="changeValue($event, 'resolveXP')"
          />
          <div class="attribute-list">
            <AttributeTile
              :effectable="sheet.attrAttune"
              :change="(quantity: number) => changeValue(quantity, 'attrAttune/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrCommand"
              :change="(quantity: number) => changeValue(quantity, 'attrCommand/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrConsort"
              :change="(quantity: number) => changeValue(quantity, 'attrConsort/quantity')"
            />
            <AttributeTile
              :effectable="sheet.attrSway"
              :change="(quantity: number) => changeValue(quantity, 'attrSway/quantity')"
            />
          </div>
        </section>
      </div>
      <div>
        <section>
          <label
            >Load
            <label class="muted"
              >({{ amountOfLoadUsed
              }}{{ selectedLoad && '/' + selectedLoad.max }})</label
            >
          </label>
          <div class="row wrap">
            <button
              v-for="load in sheet.load"
              class="btn btn--tab"
              :class="{ active: load.id === sheet.selectedLoad }"
              @click="
                changeValue(
                  load.id === sheet.selectedLoad ? null : load.id,
                  'selectedLoad'
                )
              "
            >
              {{ load.name }}
              ({{ load.max }}{{ load.id === 'heavy' ? '+' : '' }})
            </button>
            <!-- New item -->
            <button
              class="btn"
              @click="
                ModalController.open(EditItemModal, {
                  propertyName: 'Item',
                  idPrefix: 'item',
                  onCreateNew: onCreateItem
                })
              "
            >
              New Item
            </button>
          </div>
          <div class="load" v-if="selectedLoad">
            <p class="muted">{{ selectedLoad.description }}</p>
          </div>
        </section>
        <section>
          <div class="tile-list" v-if="sheet.items.length > 0">
            <ItemTile
              v-for="item in sheet.items"
              :key="item.id"
              :item="item"
              :propertyName="'Item'"
              idPrefix="item"
              :onEdit="onEditItem"
              :change="(quantity: number) => changeItemQuantity(item.id, quantity)"
            />
          </div>
          <p v-if="sheet.items.length == 0" class="no-tiles">
            <em>❖ No Items</em>
          </p>
        </section>
      </div>
    </div>
    <div class="row center mobile-nav">
      <button
        class="btn btn--tab"
        @click="scrollToIndex(0)"
        :class="{ active: currentIndex == 0 }"
      >
        1 <i class="fas fa-file-alt"></i>
      </button>
      <button
        class="btn btn--tab"
        @click="scrollToIndex(1)"
        :class="{ active: currentIndex == 1 }"
      >
        2 <i class="fas fa-file-alt"></i>
      </button>
      <button
        class="btn btn--tab"
        @click="scrollToIndex(2)"
        :class="{ active: currentIndex == 2 }"
      >
        3 <i class="fas fa-file-alt"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import AttributeTile from '@/components/AttributeTile.vue';
import Checkbox from '@/components/Checkbox.vue';
import CheckboxBar from '@/components/CheckboxBar.vue';
import Clock from '@/components/Clock.vue';
import CollapsingShelf from '@/components/CollapsingShelf.vue';
import EffectableTile from '@/components/EffectableTile.vue';
import HarmTile from '@/components/HarmTile.vue';
import ItemTile from '@/components/ItemTile.vue';
import PersonTile from '@/components/PersonTile.vue';
import EditEffectableModal from '@/components/modals/modal-content/EditEffectableModal.vue';
import EditItemModal from '@/components/modals/modal-content/EditItemModal.vue';
import EditPersonModal from '@/components/modals/modal-content/EditPersonModal.vue';
import { patch } from '@/controllers/game-controller';
import ModalController from '@/controllers/modal-controller';
import { Effectable, Item, Person } from '@/game-data/game-data-types';
import { Character } from '@/game-data/sheets/character-sheet';
import { Crew } from '@/game-data/sheets/crew-sheet';
import Sheet from '@/game-data/sheets/sheet';
import { getSheetImage } from '@/game-data/sheets/sheet-util';
import { useGameStore } from '@/stores/game-store';
import { pick } from '@/util/rand-helper';
import { text } from '@/util/string';
import { computed, defineProps, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  sheet: Character;
}>();

/**
 *
 * Functionality & Sheet API
 *
 */

const codex = useGameStore().game?.codex;
onMounted(() => {
  document.addEventListener('blur', onBlur, true);
});
onUnmounted(() => {
  document.removeEventListener('blur', onBlur, true);
});
const focus = ref();
function onBlur(event: FocusEvent) {
  if ((event.relatedTarget as HTMLElement)?.closest('.shelf')) return;
  focus.value = null;
}

function changeValue(value: any, partialPath: string) {
  console.log('onChangeValue', value, partialPath);
  const path = `/data/sheets/${props.sheet.id}/${partialPath}`;
  patch([
    {
      op: 'replace',
      path,
      value
    }
  ]);
}

// Crew
const crewSheets = computed(() => {
  return (
    Object.values(useGameStore().game?.data?.sheets || []) as Sheet[]
  ).filter((sheet) => sheet.sheetType === 'crew') as Crew[];
});

const crew = computed(() => {
  return (
    crewSheets.value.find((crew) => crew.id === props.sheet.crewId) || null
  );
});

// Name
function randomizeName() {
  const firstNames = codex?.names?.firstNames || [];
  const lastNames = codex?.names?.lastNames || [];
  const firstName = pick(firstNames);
  const lastName = pick(lastNames);
  changeValue(`${firstName} ${lastName}`, 'name');
}

// Alias
function randomizeAlias() {
  const aliases = codex?.names?.aliases || [];
  const alias = pick(aliases);
  changeValue(alias, 'alias');
}

// Vice Purveyors
const vicePurveyors = computed(() => {
  return codex.sheets?.character?.vicePurveyors.filter((purveyor: any) =>
    purveyor.vices.includes(props.sheet.vice.toLowerCase())
  );
});

// Contacts
const showOnlySelectedContacts = ref(
  localStorage.getItem('showOnlySelectedContacts') === 'true'
);
const contacts = computed(() => {
  return showOnlySelectedContacts.value
    ? props.sheet.contacts.filter((a) => a.attitude !== 0)
    : props.sheet.contacts;
});

function onEditContact(contact: Person) {
  const contactIndex = props.sheet.contacts.findIndex(
    (a) => a.id === contact.id
  );
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/contacts/${contactIndex}`,
      value: contact
    }
  ]);
}
function onDeleteContact(id: string) {
  const contactIndex = props.sheet.contacts.findIndex((a) => a.id === id);
  patch([
    {
      op: 'remove',
      path: `/data/sheets/${props.sheet.id}/contacts/${contactIndex}`
    }
  ]);
}
function onChangeContact(contact: Person, attitude: number) {
  const contactIndex = props.sheet.contacts.findIndex(
    (a) => a.id === contact.id
  );
  const path = `/data/sheets/${props.sheet.id}/contacts/${contactIndex}/attitude`;
  patch([
    {
      op: 'replace',
      path,
      value: attitude
    }
  ]);
}
function onCreateContact(contact: Person) {
  patch([
    {
      op: 'add',
      path: `/data/sheets/${props.sheet.id}/contacts/-`,
      value: contact
    }
  ]);
}

// Stress
const maxStress = computed(() => {
  const baseMaxStress = props.sheet.maxStress;
  // TODO: Apply effects from crew
  return baseMaxStress;
});

// Traumas
const showOnlySelectedTraumas = ref(
  localStorage.getItem('showOnlySelectedTraumas') === 'true'
);
const traumas = computed(() => {
  return showOnlySelectedTraumas.value
    ? props.sheet.traumas.filter((t) => t.quantity > 0)
    : props.sheet.traumas;
});

function onChangeTrauma(trauma: any, quantity: number) {
  const traumaIndex = props.sheet.traumas.findIndex((t) => t.id === trauma.id);
  const path = `/data/sheets/${props.sheet.id}/traumas/${traumaIndex}/quantity`;
  patch([
    {
      op: 'replace',
      path,
      value: quantity
    }
  ]);
}

const maxTraumas = computed(() => {
  const baseMaxTraumas = props.sheet.maxTraumas;
  // TODO: Apply effects from crew
  return baseMaxTraumas;
});

// Harm
function changeHarm(index: number, newDescription: string) {
  const path = `/data/sheets/${props.sheet.id}/harms/${index}/description`;
  patch([
    {
      op: 'replace',
      path,
      value: newDescription
    }
  ]);
}

// Attributes
const insight = computed(() => {
  return props.sheet.attrHunt.quantity > 0
    ? 1
    : 0 + props.sheet.attrStudy.quantity > 0
    ? 1
    : 0 + props.sheet.attrSurvey.quantity > 0
    ? 1
    : 0 + props.sheet.attrTinker.quantity > 0
    ? 1
    : 0;
});

const prowess = computed(() => {
  return props.sheet.attrFinesse.quantity > 0
    ? 1
    : 0 + props.sheet.attrProwl.quantity > 0
    ? 1
    : 0 + props.sheet.attrSkirmish.quantity > 0
    ? 1
    : 0 + props.sheet.attrWreck.quantity > 0
    ? 1
    : 0;
});

const resolve = computed(() => {
  return props.sheet.attrAttune.quantity > 0
    ? 1
    : 0 + props.sheet.attrCommand.quantity > 0
    ? 1
    : 0 + props.sheet.attrConsort.quantity > 0
    ? 1
    : 0 + props.sheet.attrSway.quantity > 0
    ? 1
    : 0;
});

// Special Abilities
const showOnlySelectedAbilities = ref(false);
const specialAbilities = computed(() => {
  return showOnlySelectedAbilities.value
    ? props.sheet.specialAbilities.filter((a) => a.quantity > 0)
    : props.sheet.specialAbilities;
});

function onChangeAbility(ability: any, quantity: number) {
  const abilityIndex = props.sheet.specialAbilities.findIndex(
    (a) => a.id === ability.id
  );
  const path = `/data/sheets/${props.sheet.id}/specialAbilities/${abilityIndex}/quantity`;
  patch([
    {
      op: 'replace',
      path,
      value: quantity
    }
  ]);
}
function onEditAbility(ability: Effectable) {
  const abilityIndex = props.sheet.specialAbilities.findIndex(
    (a) => a.id === ability.id
  );
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/specialAbilities/${abilityIndex}`,
      value: ability
    }
  ]);
}
function onDeleteAbility(id: string) {
  const abilityIndex = props.sheet.specialAbilities.findIndex(
    (a) => a.id === id
  );
  patch([
    {
      op: 'remove',
      path: `/data/sheets/${props.sheet.id}/specialAbilities/${abilityIndex}`
    }
  ]);
}
function onCreateAbility(ability: Effectable) {
  patch([
    {
      op: 'add',
      path: `/data/sheets/${props.sheet.id}/specialAbilities/-`,
      value: ability
    }
  ]);
}

// Load
const selectedLoad = computed(() => {
  const load = props.sheet.load.find((l) => l.id === props.sheet.selectedLoad);
  return load;
});

const amountOfLoadUsed = computed(() => {
  return props.sheet.items.reduce(
    (acc, item) => (item.quantity > 0 ? acc + item.load : acc),
    0
  );
});

function changeItemQuantity(id: string, quantity: number) {
  const itemIndex = props.sheet.items.findIndex((i) => i.id === id);
  const partialPath = `items/${itemIndex}/quantity`;
  changeValue(quantity, partialPath);
}

function onCreateItem(item: Item) {
  const partialPath = `items/-`;
  changeValue(item, partialPath);
}

function onEditItem(item: Item) {
  const itemIndex = props.sheet.items.findIndex((i) => i.id === item.id);
  const partialPath = `items/${itemIndex}`;
  changeValue(item, partialPath);
}

/**
 *
 * Watch for UI changes
 *
 */

watch(
  [showOnlySelectedContacts, showOnlySelectedTraumas],
  ([showOnlySelectedContacts, showOnlySelectedTraumas]) => {
    localStorage.setItem(
      'showOnlySelectedContacts',
      showOnlySelectedContacts.toString()
    );
    localStorage.setItem(
      'showOnlySelectedTraumas',
      showOnlySelectedTraumas.toString()
    );
  }
);

/**
 *
 *  Mobile Only
 *
 **/

const currentIndex = ref(0);
const carouselRef = ref<HTMLElement | null>(null);
function updateCurrentIndex(carousel: HTMLElement) {
  const index = Math.round(carousel.scrollLeft / carousel.clientWidth);
  currentIndex.value = index;
}

function scrollToIndex(index: number) {
  if (!carouselRef.value) return;
  carouselRef.value.scrollTo({
    top: 0
  });

  carouselRef.value.scrollTo({
    left: carouselRef.value.clientWidth * index,
    behavior: 'smooth'
  });
}
</script>

<style scoped lang="scss">
/** TEMPORARY */
code {
  color: yellow;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1.6rem;
}

/** LAYOUT */
.sheet-layout__nested {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.character-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  flex: 1;
  overflow-y: auto;

  > div {
    padding: 1rem;
    min-width: 100%;

    // dividing vertical lines between divs
    &:not(:last-child) {
      border-right: 1px solid var(--dark-2);
    }

    section {
      padding: 1rem;
      color: var(--light);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }
}

/** HARMS */
.harms-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
  > *:first-child {
    grid-column: 1 / -1;
  }

  > p {
    grid-column: 1 / -1;
    text-align: center;
    opacity: 0.6;
    height: 2rem;
  }

  > p.harm {
    opacity: 1;
    color: var(--red);
    font-weight: bold;
    :deep(*) {
      opacity: 1;
      color: var(--red);
    }
  }
}

/** ATTRIBUTES */
.attribute-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
}

/** TITLE CARD */
.character-type-card {
  position: relative;
  box-shadow: var(--shadow);
  overflow: hidden;
  border-radius: 5px;
  height: 24rem;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .input-group {
    margin-top: 2rem;
    gap: 0;
    label {
      color: var(--primary);
      text-align: center;
    }
  }

  > h1,
  h2,
  p {
    z-index: 1;
    color: var(--light);
  }

  h1 {
    font-size: 4rem;
    line-height: 1;
    overflow: hidden;
    text-align: center;
    margin: 0.8rem;
  }

  h1.extra-long {
    font-size: 3.2rem;
  }

  h2 {
    font-size: 1.2rem;
    letter-spacing: 4px;
    opacity: 0.6;
    text-align: center;
  }

  > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
    z-index: 0;
    filter: brightness(0.6);
  }
}

/** MOBILE NAVIGATION */
.mobile-nav {
  display: none;

  justify-content: center;
  padding: 0.4rem;
  width: 100%;

  background-color: var(--dark);
  box-shadow: var(--shadow);
  z-index: 1;
}

/** TABLET */
@media (max-width: 1079px) {
  .character-layout {
    display: flex;
    // overflow-x: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;

    > div {
      min-width: 100%;
      height: 100%;
      overflow-y: auto;
      scroll-snap-align: start;
    }
  }

  .mobile-nav {
    display: flex;
  }
}

/** MOBILE */
@media (max-width: 767px) {
  section label {
    text-align: center;
  }

  .checkbox-bar {
    margin: 0 auto;
  }
}
</style>
