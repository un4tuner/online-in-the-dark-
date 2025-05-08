<template>
  <div class="sheet-layout__nested">
    <div
      class="crew-layout"
      ref="carouselRef"
      @scroll="updateCurrentIndex($event.target as HTMLElement)"
    >
      <div class="main-and-claims" :class="{ active: currentIndex == 0 }">
        <section>
          <div
            class="crew-type-card"
            :style="{
              backgroundColor: getSheetImage(sheet.image)?.commonColor
            }"
          >
            <img :src="getSheetImage(sheet.image)?.url" />
            <h1 :class="{ 'extra-long': sheet.name.length > 20 }">
              {{ sheet.name }}
            </h1>
            <h2>
              {{ sheet.crewTypeDescription }}
            </h2>
            <div class="input-group crew-tier">
              <NumberStepper
                id="crew-tier"
                label="Tier"
                :value="props.sheet.tier"
                :min="0"
                :max="5"
                @change="changeValue($event, 'tier')"
              />
            </div>
          </div>

          <div class="input-group name-and-description">
            <label for="crew-name">Name</label>
            <input
              id="crew-name"
              type="text"
              :value="props.sheet.name"
              @focus="focus = 'name'"
              :placeholder="'Untitled ' + sheet.crewType"
              @change="
                changeValue(($event.target as HTMLInputElement)?.value, 'name')
              "
              :class="{ locked: lockLevel < 1 }"
              :disabled="lockLevel < 1"
            />
            <CollapsingShelf :show="focus == 'name'">
              <p>Choose a name for your crew.</p>
            </CollapsingShelf>
            <textarea
              id="crew-description"
              :value="props.sheet.description"
              @focus="focus = 'description'"
              placeholder="A group of scoundrels scraping by in the underworld"
              @change="
                changeValue(
                  ($event.target as HTMLTextAreaElement)?.value,
                  'description'
                )
              "
              :class="{ locked: lockLevel < 1 }"
              :disabled="lockLevel < 1"
            >
            </textarea>
            <CollapsingShelf :show="focus == 'description'">
              <p>Describe your crew in a few sentences.</p>
            </CollapsingShelf>
          </div>

          <div class="input-group">
            <label for="reputation-type">Reputation</label>
            <input
              id="reputation-type"
              type="text"
              :value="props.sheet.reputationType"
              @focus="focus = 'reputation-type'"
              placeholder="Ambitious"
              @change="
                changeValue(
                  ($event.target as HTMLInputElement)?.value,
                  'reputationType'
                )
              "
              :class="{ locked: lockLevel < 1 }"
              :disabled="lockLevel < 1"
            />
            <CollapsingShelf :show="focus == 'reputation-type'">
              <p>Choose how other underworld factions see you.</p>
              <div class="text-list">
                <button
                  class="btn btn--text"
                  v-for="reputation in codex.sheets.crew.reputations"
                  @mousedown="changeValue(reputation, 'reputationType')"
                >
                  {{ reputation }}
                </button>
              </div>
            </CollapsingShelf>
          </div>
          <Divider v-if="props.sheet.crewType === 'Cult'" />
          <div class="input-group" v-if="props.sheet.crewType === 'Cult'">
            <!-- deityName   -->
            <div class="input-group">
              <label for="deity-name">Deity</label>
              <div class="row flat">
                <input
                  id="deity-name"
                  type="text"
                  :value="(props.sheet as Cult).deityName"
                  placeholder="By what name do you know your deity?"
                  @focus="focus = 'deity-name'"
                  @change="
                    changeValue(
                      ($event.target as HTMLInputElement)?.value,
                      'deityName'
                    )
                  "
                  :class="{ locked: lockLevel < 1 }"
                  :disabled="lockLevel < 1"
                />
                <button
                  class="btn btn--icon"
                  @click="randomizeDeityName"
                  :class="{ removed: lockLevel < 1 }"
                >
                  <i class="fas fa-random"></i>
                </button>
              </div>
            </div>

            <!-- deityFeatures -->
            <div class="input-group">
              <input
                id="deity-features"
                type="text"
                @focus="focus = 'deity-features'"
                @change="
                  changeValue(
                    ($event.target as HTMLInputElement)?.value,
                    'deityFeatures'
                  )
                "
                placeholder="Describe your deity in a few words"
                :value="(props.sheet as Cult).deityFeatures"
                :class="{ locked: lockLevel < 1 }"
                :disabled="lockLevel < 1"
              />
              <CollapsingShelf :show="focus == 'deity-features'">
                <p>Choose two features from the list to describe your deity.</p>
                <div class="text-list">
                  <button
                    class="btn btn--text"
                    v-for="feature in [
                      'Alluring',
                      'Cruel',
                      'Ferocious',
                      'Monstrous',
                      'Radiant',
                      'Sinister',
                      'Serene',
                      'Transcendent'
                    ]"
                    :key="feature"
                    @mousedown="
                      changeValue(
                        (sheet as Cult).deityFeatures.length
                          ? (sheet as Cult).deityFeatures +
                              ', ' +
                              feature.toLowerCase()
                          : feature,
                        'deityFeatures'
                      )
                    "
                  >
                    {{ feature }}
                  </button>
                </div>
              </CollapsingShelf>
            </div>
          </div>

          <Divider />
          <div class="input-group">
            <label for="crew-lair">Lair</label>
            <div class="row flat">
              <input
                id="crew-lair"
                type="text"
                :value="props.sheet.lair"
                placeholder="Where your crew hatches its schemes"
                @focus="focus = 'lair'"
                @change="
                  changeValue(
                    ($event.target as HTMLInputElement)?.value,
                    'lair'
                  )
                "
                :class="{ locked: lockLevel < 1 }"
                :disabled="lockLevel < 1"
              />
              <button
                class="btn btn--icon"
                @click="randomizeLair"
                :class="{ removed: lockLevel < 1 }"
              >
                <i class="fas fa-random"></i>
              </button>
            </div>
            <div class="input-group">
              <input
                id="crew-lair-district"
                type="text"
                :value="props.sheet.lairDistrict"
                placeholder="Where do you call home?"
                @focus="focus = 'lair-district'"
                @change="
                  changeValue(
                    ($event.target as HTMLInputElement)?.value,
                    'lairDistrict'
                  )
                "
                :class="{ locked: lockLevel < 1 }"
                :disabled="lockLevel < 1"
              />
              <CollapsingShelf :show="focus == 'lair-district'">
                <p>Where is your lair located?</p>
                <div class="text-list">
                  <button
                    class="btn btn--text"
                    v-for="district in codex.lexicon.districts.map((d:any) => d.name)"
                    :key="district"
                    @mousedown="changeValue(district, 'lairDistrict')"
                  >
                    {{ district }}
                  </button>
                </div>
              </CollapsingShelf>
            </div>
          </div>
          <Divider />
          <label>{{ sheet.huntingGroundsLabel }}</label>
          <div class="row">
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedHuntingGrounds"
              label="Show only selected"
            />
          </div>
          <div
            class="tile-list tile-list--mini"
            v-if="huntingGrounds.length > 0"
          >
            <EffectableTile
              v-for="ground in huntingGrounds"
              :effectable="ground"
              :key="ground.id"
              :idPrefix="props.sheet.crewType"
              :propertyName="sheet.huntingGroundsLabel"
              :change="(quantity: number) => onChangeHuntingGround(ground, quantity)"
              :onEdit="onEditHuntingGround"
              :onDelete="() => {}"
            />
          </div>
          <p v-if="huntingGrounds.length == 0" class="no-tiles">
            <em>❖ No {{ sheet.huntingGroundsLabel }} selected</em>
          </p>
        </section>
        <Divider />
        <section>
          <div class="input-block">
            <div class="input-group crew-rep">
              <label for="crew-rep">Rep</label>
              <CheckboxBar
                id="crew-rep"
                :value="props.sheet.reputation"
                :locked="props.sheet.turf"
                :max="12"
                @change="changeValue($event, 'reputation')"
              />
            </div>
          </div>
          <div class="input-block turf-and-hold">
            <div class="input-group">
              <NumberStepper
                id="crew-turf"
                :value="props.sheet.turf"
                :min="0"
                :max="5"
                label="Turf"
                @change="changeValue($event, 'turf')"
              />
            </div>
            <div class="input-group" :class="{ locked: lockLevel < 1 }">
              <label for="crew-hold">Hold</label>
              <div class="row flat">
                <button
                  class="btn btn--tab"
                  @click="changeValue('weak', 'hold')"
                  :class="{ active: props.sheet.hold == 'weak' }"
                >
                  Weak
                </button>
                <button
                  class="btn btn--tab"
                  @click="changeValue('strong', 'hold')"
                  :class="{ active: props.sheet.hold == 'strong' }"
                >
                  Strong
                </button>
              </div>
            </div>
          </div>
          <InfoBox>
            <p
              v-html="
                text(
                  'Completing a score earns your Crew [/rep +2 Rep]\n\nTake [/rep +1 Rep] per *Tier* higher than your target, or [/rep -1 Rep] per *Tier* lower'
                )
              "
            ></p>
          </InfoBox>
          <InfoBox>
            <p
              v-html="
                text(
                  `With a full tracker, the Crew can't earn more *Rep* until you do one of the following, then reset the tracker`
                )
              "
            ></p>

            <ul>
              <li
                v-html="
                  text(
                    `If your *Hold* is Strong, increase your *Tier* by paying [/coin Coin] equal to 8x your new *Tier*\nReduce your *Hold* to Weak`
                  )
                "
              ></li>
              <li
                v-html="text(`If your *Hold* is Weak, increase it to Strong`)"
              ></li>
            </ul>
          </InfoBox>
        </section>
        <Divider />
        <section>
          <div class="input-block heat-and-wanted-level">
            <div class="input-group">
              <label for="crew-heat">Heat & Wanted Level</label>
              <CheckboxBar
                id="crew-heat"
                :value="props.sheet.heat"
                :max="9"
                @change="changeValue($event, 'heat')"
              />
            </div>
            <NumberStepper
              id="crew-wanted-level"
              :value="props.sheet.wantedLevel"
              :min="0"
              :max="5"
              @change="changeValue($event, 'wantedLevel')"
            />
          </div>
          <InfoBox>
            <p
              v-html="
                text(
                  `When the tracker is full, increase the *Wanted Level* and clear all your *Heat*\n\nThe only way to reduce your *Wanted Level* is through *Incarceration*. When one of the PCs, friends, contacts—or a framed enemy—is convicted and incarcerated for crimes associated with your Crew, clear your *Heat* and reduce your *Wanted Level* by 1`
                )
              "
            ></p>
          </InfoBox>
          <Divider />
          <div class="input-group coin-group">
            <label for="crew-coin"
              >Treasury
              <label class="muted">{{ vaultsText }}</label>
            </label>
            <CheckboxBar
              id="crew-coin"
              :value="props.sheet.coin"
              :max="16"
              :locked="16 - maxCoin"
              :coinMode="true"
              @change="changeValue($event, 'coin')"
            />
            <InfoBox>
              <p
                v-html="
                  text(
                    `Most *Districts* have crime bosses that expect smaller crews to pay a tithe from their scores\n\nIs there a boss that you should be paying? Subtract [/coin Coin] equal to your *Tier* +1 when you pay a tithe`
                  )
                "
              ></p>
            </InfoBox>
          </div>
        </section>
        <Divider />
        <section>
          <label for="claims">Claims</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditClaimsModal, {
                  sheetId: props.sheet.id,
                  claims: props.sheet.claims
                })
              "
              :class="{ removed: lockLevel < 1 }"
            >
              <span>Edit Claims</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showClaimsDetails"
              label="Show details"
            />
          </div>
          <div class="claims-list">
            <ClaimTile
              v-for="claim in claims"
              :key="claim.id"
              :claim="claim"
              :showDetails="showClaimsDetails"
              :idPrefix="props.sheet.crewType"
              propertyName="Claim"
              :neighborClaims="getNeighborClaims(claim)"
              :change="(quantity: number) => onChangeClaim(claim, quantity)"
              :class="{ locked: lockLevel < 1 }"
            />
          </div>
        </section>
      </div>
      <div
        class="abilities-xp-and-contacts"
        :class="{ active: currentIndex == 1 }"
      >
        <section class="crew-xp-section">
          <div class="input-group crew-xp">
            <label for="crew-xp">Crew XP</label>
            <CheckboxBar
              id="crew-xp"
              :value="props.sheet.crewExperience"
              :max="9"
              @change="changeValue($event, 'crewExperience')"
            />
          </div>

          <InfoBox>
            <p
              v-html="
                text(
                  `For each item below, mark [/xp 1 XP]\nIf it occurred more than once, mark [/xp 2 XP]`
                )
              "
            ></p>
            <ul>
              <li
                v-for="label in [
                  ...sheet.crewExperienceLabels,
                  ...(sheet.crewDefaultExperienceLabels || [])
                ]"
                v-html="text(label)"
              ></li>
            </ul>
          </InfoBox>
          <InfoBox>
            <p
              v-html="
                text(
                  `When the tracker is full, choose one *Special Ability* or two *Upgrades* and clear the *XP*\n\nEvery time the crew advances, each PC gets [/coin +1 Stash] and an additional [/coin +2 Stash] for each *Tier*`
                )
              "
            ></p>
          </InfoBox>
        </section>
        <Divider />
        <section>
          <label for="crew-abilities">Special Abilities</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Special Ability',
                  idPrefix: sheet.crewType,
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
          <div class="tile-list" v-if="specialAbilities.length > 0">
            <EffectableTile
              v-for="ability in specialAbilities"
              :key="ability.id"
              :effectable="ability"
              :idPrefix="props.sheet.crewType"
              :propertyName="'Special Ability'"
              :change="(quantity: number) => onChangeAbility(ability, quantity)"
              :onEdit="onEditAbility"
              :onDelete="onDeleteAbility"
            />
          </div>
          <p v-if="specialAbilities.length == 0" class="no-tiles">
            <em>❖ No Special Abilities selected</em>
          </p>
        </section>
        <Divider />
        <section>
          <label for="crew-upgrades">Crew Upgrades</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Upgrade',
                  idPrefix: sheet.crewType + '-upgrade',
                  onCreateNew: (upgrade: Effectable) =>
                    onCreateUpgrade(upgrade, 'crew')
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedCrewUpgrades"
              label="Show only selected"
            />
          </div>
          <div class="tile-list" v-if="crewUpgrades.length > 0">
            <EffectableTile
              v-for="upgrade in crewUpgrades"
              :key="upgrade.id"
              :effectable="upgrade"
              :idPrefix="props.sheet.crewType + '-upgrade'"
              :propertyName="'Upgrade'"
              :change="
                (quantity) => {
                  onChangeUpgrade(upgrade, quantity, 'crew');
                }
              "
              :onEdit="
                (ability) => {
                  onEditUpgrade(ability, 'crew');
                }
              "
              :onDelete="(id) => onDeleteUpgrade(id, 'crew')"
            />
          </div>
          <p v-if="crewUpgrades.length == 0" class="no-tiles">
            <em>❖ No crew upgrades selected</em>
          </p>
        </section>

        <Divider />

        <section>
          <label for="crew-lair-upgrades">Lair Upgrades</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Upgrade',
                  idPrefix: sheet.crewType + '-lair-upgrade',
                  onCreateNew: (upgrade: Effectable) =>
                    onCreateUpgrade(upgrade, 'lair')
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedLairUpgrades"
              label="Show only selected"
            />
          </div>
          <div class="tile-list" v-if="lairUpgrades.length > 0">
            <EffectableTile
              v-for="upgrade in lairUpgrades"
              :key="upgrade.id"
              :effectable="upgrade"
              :idPrefix="props.sheet.crewType + '-lair-upgrade'"
              :propertyName="'Upgrade'"
              :change="
                (quantity) => {
                  onChangeUpgrade(upgrade, quantity, 'lair');
                }
              "
              :onEdit="
                (ability) => {
                  onEditUpgrade(ability, 'lair');
                }
              "
              :onDelete="(id) => onDeleteUpgrade(id, 'lair')"
            />
          </div>
          <p v-if="lairUpgrades.length == 0" class="no-tiles">
            <em>❖ No lair upgrades selected</em>
          </p>
        </section>

        <Divider />

        <section>
          <label for="crew-training-upgrades">Training Upgrades</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Upgrade',
                  idPrefix: sheet.crewType + '-training-upgrade',
                  onCreateNew: (upgrade: Effectable) =>
                    onCreateUpgrade(upgrade, 'training')
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedTrainingUpgrades"
              label="Show only selected"
            />
          </div>
          <div class="tile-list" v-if="trainingUpgrades.length > 0">
            <EffectableTile
              v-for="upgrade in trainingUpgrades"
              :key="upgrade.id"
              :effectable="upgrade"
              :idPrefix="props.sheet.crewType + '-training-upgrade'"
              :propertyName="'Upgrade'"
              :change="
                (quantity) => {
                  onChangeUpgrade(upgrade, quantity, 'training');
                }
              "
              :onEdit="
                (ability) => {
                  onEditUpgrade(ability, 'training');
                }
              "
              :onDelete="(id) => onDeleteUpgrade(id, 'training')"
            />
          </div>
          <p v-if="trainingUpgrades.length == 0" class="no-tiles">
            <em>❖ No training upgrades selected</em>
          </p>
        </section>

        <Divider />

        <section>
          <label for="crew-quality-upgrades">Quality Upgrades</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditEffectableModal, {
                  propertyName: 'Upgrade',
                  idPrefix: sheet.crewType + '-quality-upgrade',
                  onCreateNew: (upgrade: Effectable) =>
                    onCreateUpgrade(upgrade, 'quality')
                })
              "
            >
              <span>New</span>
            </button>
            <Checkbox
              icon="fa-low-vision"
              v-model="showOnlySelectedQualityUpgrades"
              label="Show only selected"
            />
          </div>
          <div class="tile-list" v-if="qualityUpgrades.length > 0">
            <EffectableTile
              v-for="upgrade in qualityUpgrades"
              :key="upgrade.id"
              :effectable="upgrade"
              :idPrefix="props.sheet.crewType + '-quality-upgrade'"
              :propertyName="'Upgrade'"
              :change="
                (quantity) => {
                  onChangeUpgrade(upgrade, quantity, 'quality');
                }
              "
              :onEdit="
                (ability) => {
                  onEditUpgrade(ability, 'quality');
                }
              "
              :onDelete="(id) => onDeleteUpgrade(id, 'quality')"
            />
          </div>
          <p v-if="qualityUpgrades.length == 0" class="no-tiles">
            <em>❖ No quality upgrades selected</em>
          </p>
        </section>
      </div>
      <div class="upgrades" :class="{ active: currentIndex == 2 }">
        <section>
          <label for="contacts">Crew Contacts</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditPersonModal, {
                  propertyName: 'Crew Contact',
                  idPrefix: sheet.crewType + '-contact',
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
              :idPrefix="props.sheet.crewType + '-contact'"
              propertyName="Crew Contact"
              :person="contact"
              :change="onChangeContact"
              :onEdit="onEditContact"
              :onDelete="onDeleteContact"
              :options="[
                // { value: -1, icon: 'fas fa-caret-down' },
                // { value: 1, icon: 'fas fa-caret-up' },
                { value: 1, text: '❖' }
              ]"
            />
          </div>
          <p v-if="contacts.length == 0" class="no-tiles">
            <em>❖ No Crew Contacts selected</em>
          </p>
        </section>

        <Divider />

        <section>
          <label for="cohorts">Cohorts</label>
          <div class="row">
            <button
              class="btn"
              @click="
                ModalController.open(EditCohortModal, {
                  propertyName: 'gang',
                  idPrefix: sheet.crewType + '-gang',
                  onCreateNew: onCreateCohort
                })
              "
            >
              <i class="fas fa-plus-circle"></i>
              <span>Gang</span>
            </button>
            <button
              class="btn"
              @click="
                ModalController.open(EditCohortModal, {
                  propertyName: 'expert',
                  idPrefix: sheet.crewType + '-expert',
                  onCreateNew: onCreateCohort
                })
              "
            >
              <i class="fas fa-plus-circle"></i>
              <span>Expert</span>
            </button>
            <button
              v-if="props.sheet.crewType === 'Smugglers'"
              class="btn"
              :class="{
                disabled: !quantityById('like-part-of-the-family')
              }"
              @click="
                ModalController.open(EditCohortModal, {
                  propertyName: 'vehicle',
                  idPrefix: sheet.crewType + '-vehicle',
                  onCreateNew: onCreateCohort
                })
              "
            >
              <i class="fas fa-plus-circle"></i>
              <span>Vehicle</span>
            </button>
          </div>
          <div class="tile-list" v-if="cohorts.length > 0">
            <CohortTile
              v-for="cohort in cohorts"
              :key="cohort.id"
              :cohort="cohort"
              :idPrefix="props.sheet.crewType"
              :onEdit="onEditCohort"
              :onDelete="onDeleteCohort"
            />
          </div>
          <p v-if="cohorts.length == 0" class="no-tiles">
            <em>❖ Your crew hasn't recruited any cohorts</em>
          </p>
        </section>
      </div>
    </div>
    <div class="row center mobile-nav">
      <!-- <button
        class="btn btn--icon cycle-lock-level"
        v-if="useGameStore().userPlayer?.role === PlayerRole.GM"
        @click="cycleLockLevel"
      >
        <i
          class="fas"
          :class="{
            'fa-lock': lockLevel === 0,
            'fa-unlock': lockLevel === 1,
            'fa-lock-open': lockLevel === 2
          }"
        ></i>
      </button> -->
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
import Checkbox from '@/components/Checkbox.vue';
import CheckboxBar from '@/components/CheckboxBar.vue';
import ClaimTile from '@/components/ClaimTile.vue';
import CohortTile from '@/components/CohortTile.vue';
import CollapsingShelf from '@/components/CollapsingShelf.vue';
import EffectableTile from '@/components/EffectableTile.vue';
import InfoBox from '@/components/InfoBox.vue';
import NumberStepper from '@/components/NumberStepper.vue';
import PersonTile from '@/components/PersonTile.vue';
import EditClaimsModal from '@/components/modals/modal-content/EditClaimsModal.vue';
import EditCohortModal from '@/components/modals/modal-content/EditCohortModal.vue';
import EditEffectableModal from '@/components/modals/modal-content/EditEffectableModal.vue';
import EditPersonModal from '@/components/modals/modal-content/EditPersonModal.vue';
import { patch } from '@/controllers/game-controller';
import ModalController from '@/controllers/modal-controller';
import { Effectable, Person } from '@/game-data/game-data-types';
import {
  Claim,
  Cohort,
  Crew,
  Cult,
  Direction
} from '@/game-data/sheets/crew-sheet';
import { getSheetImage } from '@/game-data/sheets/sheet-util';
import { useGameStore } from '@/stores/game-store';
import { PlayerRole } from '@/types/game';
import { pick } from '@/util/rand-helper';
import { text } from '@/util/string';
import { computed, defineProps, onMounted, onUnmounted, ref, watch } from 'vue';

const WIDE_TILE_DESCRIPTION_THRESHOLD = 200;
const codex = useGameStore().game?.codex;

onMounted(() => {
  document.addEventListener('blur', onBlur, true);
});

onUnmounted(() => {
  document.removeEventListener('blur', onBlur, true);
});

const props = defineProps<{
  sheet: Crew;
}>();

const currentIndex = ref(0);
const carouselRef = ref<HTMLElement | null>(null);

const focus = ref();
function onBlur(event: FocusEvent) {
  if ((event.relatedTarget as HTMLElement)?.closest('.shelf')) return;
  focus.value = null;
}

function cycleLockLevel() {
  // Cycle through lock levels (0, 1, 2)
  let newLockLevel = props.sheet.lockLevel + 1;
  if (newLockLevel > 2) newLockLevel = 0;
  changeValue(newLockLevel, 'lockLevel');
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

const maxCoin = computed(() => {
  const vaults = quantityById('vault');
  console.log('vault:', vaults);
  if (vaults === 1) return 8;
  if (vaults === 2) return 16;
  return 4;
});

const vaultsText = computed(() => {
  const vaults = quantityById('vault');
  if (vaults === 1) return '& one Vault';
  if (vaults === 2) return '& two Vaults';
  return '';
});

function updateCurrentIndex(carousel: HTMLElement) {
  // Get the current index from the scroll position
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

function randomizeLair() {
  const lairIdeas = codex.sheets.crew.lairs;
  const { name, districts } = pick(lairIdeas);
  const district = pick(districts);
  changeValue(name, 'lair');
  changeValue(district, 'lairDistrict');
}

function randomizeDeityName() {
  const deityNames = codex.names.deityNames;
  const deityName = pick(deityNames);
  changeValue(deityName, 'deityName');
}

/** Upgrades */

const showOnlySelectedCrewUpgrades = ref(
  localStorage.getItem('showOnlySelectedCrewUpgrades') === 'true'
);
const crewUpgrades = computed(() => {
  return showOnlySelectedCrewUpgrades.value
    ? props.sheet.crewUpgrades.filter((a) => a.quantity > 0)
    : props.sheet.crewUpgrades;
});

const showOnlySelectedLairUpgrades = ref(
  localStorage.getItem('showOnlySelectedLairUpgrades') === 'true'
);
const lairUpgrades = computed(() => {
  return showOnlySelectedLairUpgrades.value
    ? props.sheet.lairUpgrades.filter((a) => a.quantity > 0)
    : props.sheet.lairUpgrades;
});

const showOnlySelectedTrainingUpgrades = ref(
  localStorage.getItem('showOnlySelectedTrainingUpgrades') === 'true'
);
const trainingUpgrades = computed(() => {
  return showOnlySelectedTrainingUpgrades.value
    ? props.sheet.trainingUpgrades.filter((a) => a.quantity > 0)
    : props.sheet.trainingUpgrades;
});

const showOnlySelectedQualityUpgrades = ref(
  localStorage.getItem('showOnlySelectedQualityUpgrades') === 'true'
);
const qualityUpgrades = computed(() => {
  return showOnlySelectedQualityUpgrades.value
    ? props.sheet.qualityUpgrades.filter((a) => a.quantity > 0)
    : props.sheet.qualityUpgrades;
});

/** Upgrades Functions */

function onEditUpgrade(
  upgrade: Effectable,
  upgradeType: 'crew' | 'lair' | 'training' | 'quality'
) {
  const upgradeIndex = props.sheet.crewUpgrades.findIndex(
    (a) => a.id === upgrade.id
  );
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/${upgradeType}Upgrades/${upgradeIndex}`,
      value: upgrade
    }
  ]);
}
function onDeleteUpgrade(
  id: string,
  upgradeType: 'crew' | 'lair' | 'training' | 'quality'
) {
  const upgradeIndex = props.sheet.crewUpgrades.findIndex((a) => a.id === id);
  patch([
    {
      op: 'remove',
      path: `/data/sheets/${props.sheet.id}/${upgradeType}Upgrades/${upgradeIndex}`
    }
  ]);
}
function onChangeUpgrade(
  upgrade: any,
  quantity: number,
  upgradeType: 'crew' | 'lair' | 'training' | 'quality'
) {
  const upgradeIndex = props.sheet[`${upgradeType}Upgrades`].findIndex(
    (a) => a.id === upgrade.id
  );

  if (upgradeIndex === -1) return console.error('Upgrade not found', upgrade);

  const path = `/data/sheets/${props.sheet.id}/${upgradeType}Upgrades/${upgradeIndex}/quantity`;
  patch([
    {
      op: 'replace',
      path,
      value: quantity
    }
  ]);
}
function onCreateUpgrade(
  upgrade: Effectable,
  upgradeType: 'crew' | 'lair' | 'training' | 'quality'
) {
  patch([
    {
      op: 'add',
      path: `/data/sheets/${props.sheet.id}/${upgradeType}Upgrades/-`,
      value: upgrade
    }
  ]);
}

/** Contacts */

const showOnlySelectedContacts = ref(
  localStorage.getItem('showOnlySelectedContacts') === 'true'
);
const contacts = computed(() => {
  return showOnlySelectedContacts.value
    ? props.sheet.contacts.filter((a) => a.attitude !== 0)
    : props.sheet.contacts;
});

/** Contacts Functions */

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

/** Special Abilities */

const showOnlySelectedAbilities = ref(
  localStorage.getItem('showOnlySelectedAbilities') === 'true'
);
const specialAbilities = computed(() => {
  return showOnlySelectedAbilities.value
    ? props.sheet.specialAbilities.filter((a) => a.quantity > 0)
    : props.sheet.specialAbilities;
});

/** Special Abilities Functions */

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

/** Helper Functions */

// function sortByDescription(a: Effectable, b: Effectable) {
//   const aExceeds = a.description.length > WIDE_TILE_DESCRIPTION_THRESHOLD;
//   const bExceeds = b.description.length > WIDE_TILE_DESCRIPTION_THRESHOLD;
//   if (aExceeds && !bExceeds) return -1;
//   if (bExceeds && !aExceeds) return 1;
//   return 0;
// }

function sortClaimsByPosition(a: Claim, b: Claim) {
  if (a.position.x !== b.position.x) return a.position.x - b.position.x;
  return b.position.y - a.position.y;
}

/** Claims */

const showClaimsDetails = ref(true);
const claims = computed(() => {
  return props.sheet.claims.sort(sortClaimsByPosition);
});

/** Claims Functions */

function getNeighborClaims(claim: Claim): { [key: string]: Claim } {
  const neighbors: { [key: string]: Claim } = {};
  const relativePositions = {
    [Direction.NORTH]: { x: 0, y: -1 },
    [Direction.EAST]: { x: 1, y: 0 },
    [Direction.SOUTH]: { x: 0, y: 1 },
    [Direction.WEST]: { x: -1, y: 0 }
  };

  claim.adjacent.forEach((direction) => {
    const relativePosition = relativePositions[direction];
    const neighborPosition = {
      x: claim.position.x + relativePosition.x,
      y: claim.position.y + relativePosition.y
    };

    const neighborClaim = props.sheet.claims.find(
      (c) =>
        c.position.x === neighborPosition.x &&
        c.position.y === neighborPosition.y
    );

    if (neighborClaim) neighbors[direction] = neighborClaim;
  });

  return neighbors;
}
function onChangeClaim(claim: any, quantity: number) {
  const claimIndex = props.sheet.claims.findIndex((a) => a.id === claim.id);
  const path = `/data/sheets/${props.sheet.id}/claims/${claimIndex}/quantity`;
  patch([
    {
      op: 'replace',
      path,
      value: quantity
    }
  ]);
}

/** Hunting Grounds */
const showOnlySelectedHuntingGrounds = ref(
  localStorage.getItem('showOnlySelectedHuntingGrounds') === 'true'
);
const huntingGrounds = computed(() => {
  return showOnlySelectedHuntingGrounds.value
    ? props.sheet.huntingGrounds.filter((a) => a.quantity > 0)
    : props.sheet.huntingGrounds;
});

function onChangeHuntingGround(ground: Effectable, quantity: number) {
  const huntingGroundIndex = props.sheet.huntingGrounds.findIndex(
    (a) => a.id === ground.id
  );
  const path = `/data/sheets/${props.sheet.id}/huntingGrounds/${huntingGroundIndex}/quantity`;
  patch([
    {
      op: 'replace',
      path,
      value: quantity
    }
  ]);
}

/** Hunting Grounds Functions */
function onEditHuntingGround(ground: Effectable) {
  const huntingGroundIndex = props.sheet.huntingGrounds.findIndex(
    (a) => a.id === ground.id
  );

  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/huntingGrounds/${huntingGroundIndex}`,
      value: ground
    }
  ]);
}

/** Cohorts */
const cohorts = computed(() => props.sheet.cohorts);

/** Cohorts Functions */
function onDeleteCohort(id: string) {
  const cohortIndex = props.sheet.cohorts.findIndex((a) => a.id === id);
  patch([
    {
      op: 'remove',
      path: `/data/sheets/${props.sheet.id}/cohorts/${cohortIndex}`
    }
  ]);
}

function onCreateCohort(cohort: Cohort) {
  patch([
    {
      op: 'add',
      path: `/data/sheets/${props.sheet.id}/cohorts/-`,
      value: cohort
    }
  ]);
}

function onEditCohort(cohort: Cohort) {
  const cohortIndex = props.sheet.cohorts.findIndex((a) => a.id === cohort.id);
  patch([
    {
      op: 'replace',
      path: `/data/sheets/${props.sheet.id}/cohorts/${cohortIndex}`,
      value: cohort
    }
  ]);
}

function quantityById(id: string) {
  const { sheet } = props;
  const list = [
    ...sheet.crewUpgrades,
    ...sheet.lairUpgrades,
    ...sheet.trainingUpgrades,
    ...sheet.qualityUpgrades,
    ...sheet.specialAbilities,
    ...sheet.claims,
    ...sheet.huntingGrounds
  ];

  const effectable: Effectable | undefined = list.find(
    (thing) => thing.id === id
  );
  if (!effectable) return -1;
  return effectable.quantity;
}

watch(
  [
    showOnlySelectedHuntingGrounds,
    showOnlySelectedAbilities,
    showOnlySelectedContacts,
    showOnlySelectedCrewUpgrades,
    showOnlySelectedLairUpgrades,
    showOnlySelectedTrainingUpgrades,
    showOnlySelectedQualityUpgrades
  ],
  () => {
    localStorage.setItem(
      'showOnlySelectedHuntingGrounds',
      showOnlySelectedHuntingGrounds.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedAbilities',
      showOnlySelectedAbilities.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedContacts',
      showOnlySelectedContacts.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedCrewUpgrades',
      showOnlySelectedCrewUpgrades.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedLairUpgrades',
      showOnlySelectedLairUpgrades.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedTrainingUpgrades',
      showOnlySelectedTrainingUpgrades.value.toString()
    );
    localStorage.setItem(
      'showOnlySelectedQualityUpgrades',
      showOnlySelectedQualityUpgrades.value.toString()
    );
  }
);

const lockLevel = 99;
</script>

<style scoped lang="scss">
.sheet-layout__nested {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.crew-layout {
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

.mobile-nav {
  display: none;

  justify-content: center;
  padding: 0.4rem;
  width: 100%;

  background-color: var(--dark);
  box-shadow: var(--shadow);
  z-index: 1;
}

.claims-list {
  // Claim must always be a 3x5 grid
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 1.6rem;
}

.crew-type-card {
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

.turf-and-hold {
  gap: 0;
  display: flex;
  background-color: var(--translucent-light);
  padding: 1rem;
  padding-left: 0;
  width: fit-content;

  .stepper {
    background-color: transparent;
  }
}

.heat-and-wanted-level {
  display: flex;
  gap: 0;
}

.input-group.name-and-description {
  #crew-name + .shelf {
    margin-bottom: -0.8rem;
  }
}

.input-block.treasury {
  display: flex;
  justify-content: space-between;
  align-items: center;
  > h1 {
    width: 100%;
    text-align: center;
    font-size: 6.4rem;
    opacity: 0.6;
  }
}

/** TABLET */
@media (max-width: 1079px) {
  .crew-layout {
    display: flex;
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
    > .cycle-lock-level {
      margin-right: auto;
    }
  }
}

/** MOBILE */
@media (max-width: 767px) {
  .input-group.crew-xp {
    align-items: center;
  }

  .input-group.crew-rep {
    align-items: center;
  }

  .turf-and-hold {
    width: 100%;
    justify-content: center;
  }

  .coin-group {
    align-items: center;
  }

  label {
    width: 100%;
    text-align: center;
  }
}
</style>
