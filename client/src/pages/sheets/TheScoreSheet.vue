<template>
  <div class="sheet-layout">
    <div class="score-sheet-layout">
      <section class="sheet-section">
        <h2>Basic Information</h2>

        <div class="input-group input-group--inline">
          <label for="score-name-input">Score Name</label>
          <input
            id="score-name-input"
            type="text"
            :value="props.sheet.name"
            placeholder="Name of this Score"
            @change="changeValue(($event.target as HTMLInputElement)?.value, 'name')"
          />

          <label for="tier-stepper">Tier</label>
          <NumberStepper
            id="tier-stepper"
            label="" :value="props.sheet.tierLevel" 
            :min="1"
            :max="5"
            @change="changeValue($event, 'tierLevel')"
          />

        </div>


        <div class="input-group">
           <label for="score-crew-name"></label> <input
            id="score-crew-name" type="text"
            :value="props.sheet.scoreName"
            placeholder="The crew this score is for"
            @change="changeValue(($event.target as HTMLInputElement)?.value, 'scoreName')"
          />
        </div>


        <div class="input-group">
          <label for="score-description">Score Description</label>
          <textarea
            id="score-description"
            :value="props.sheet.scoreDescription"
            placeholder="Describe this score"
            @change="changeValue(($event.target as HTMLTextAreaElement)?.value, 'scoreDescription')"
          ></textarea>
        </div>

        <div class="input-group">
          <label for="score-notes">Notes</label>
          <textarea
            id="score-notes"
            :value="props.sheet.notes"
            placeholder="Any additional notes for this score or score"
            @change="changeValue(($event.target as HTMLTextAreaElement)?.value, 'notes')"
          ></textarea>
        </div>
      </section>

      <section class="sheet-section">
        <h2>Clocks</h2>
        <div class="input-group">
          <label>Heat Clock: {{ props.sheet.heatClock?.name || 'Unnamed' }}</label> <InfoBox v-if="props.sheet.heatClock?.description"> <p>{{ props.sheet.heatClock.description }}</p>
          </InfoBox>
          <p>Segments: {{ props.sheet.heatClock?.segments ?? 'N/A' }}, Value: {{ props.sheet.heatClock?.value ?? 'N/A' }}</p> </div>
        </section>


        
       </div>
  </div>
</template>



<script setup lang="ts">
import InfoBox from '@/components/InfoBox.vue'; // Assuming InfoBox is a shared component
import NumberStepper from '@/components/NumberStepper.vue'; // Assuming NumberStepper is a shared component
import { Crew } from '@/game-data/sheets/crew-sheet'; 
// Assuming a similar patching mechanism for data updates
import { patch } from '@/controllers/game-controller';
// Import the Score type definition
import { Score } from '@/game-data/sheets/score-sheet';

/**
 * Props defined for this component.
 * Expects a 'sheet' object of type 'Score'.
 */
const props = defineProps<{
  sheet: Score;
}>();

/**
 * Handles updating a value on the sheet data via the patch mechanism.
 * @param value - The new value.
 * @param partialPath - The path to the property on the sheet object (relative to sheet.id).
 */
function changeValue(value: any, partialPath: string) {
  // Construct the correct path for the score sheet data
  const path = `/data/sheets/${props.sheet.id}/${partialPath}`;

  // Use the patch function to update the data
  patch([
    {
      op: 'replace', // Assuming 'replace' is the standard operation
      path,
      value
    }
  ]);
}





// You would add any computed properties or other logic here if needed
</script>

<style scoped lang="scss">
/* Add your existing styles for sheet-layout, score-sheet-layout, sheet-section, etc. here */
/* Example placeholder: */
// .sheet-layout {
//     padding: 20px;
//     background-color: #f0f0f0;
// }
// .score-sheet-layout {
//     display: grid;
//     grid-template-columns: 1fr; /* Adjust as needed for multi-column layouts */
//     gap: 20px;
// }
.sheet-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ccc; /* Example styling */
  border-radius: 5px;
}

h2 {
    margin-top: 0;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee; /* Example separator */
    padding-bottom: 5px;
}


.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column; /* Default is column */
  gap: 5px; /* Space between label and input/textarea */

  label {
    font-weight: bold; /* Example styling for labels */
  }
}

/* Style for the inline input group */
.input-group--inline {
  flex-direction: row; /* Arrange children (label, input, stepper) in a row */
  align-items: center; /* Vertically align items in the center of the row */
  gap: 10px; /* Add some space between the items */

  label {
    /* Give the label a fixed width so inputs align */
    flex-basis: 80px; /* Adjust this value as needed */
    flex-shrink: 0; /* Prevent the label from shrinking */
    text-align: right; /* Align the label text to the right */
    /* Remove bottom margin if using gap on the parent */
    margin-bottom: 0;
    font-weight: bold; /* Ensure label styling is consistent */
  }

  input[type="text"] {
    flex-grow: 1; /* Allow the input field to take up the remaining space */
    width: auto; /* Override the default width: 100% */
  }

  /* Style for the NumberStepper component if needed */
  /* Assuming the root element of NumberStepper has a class like 'number-stepper' */
  .number-stepper {
    flex-shrink: 0; /* Prevent the stepper from shrinking below its size */
    /* You might need additional styles here depending on how NumberStepper is implemented */
  }
}

/* Basic input and textarea styling example */
input[type="text"],
textarea {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

textarea {
    resize: vertical; /* Allow vertical resizing */
    min-height: 80px; /* Minimum height for textareas */
}

/* Styling for the InfoBox placeholder */
.info-box {
    margin-top: 5px;
    padding: 10px;
    background-color: #e9e9e9;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9em;
    p {
        margin: 0;
    }
}


</style>