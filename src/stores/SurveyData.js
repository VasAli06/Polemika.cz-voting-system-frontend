import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSurveyData = defineStore('SurveyData', () => {
  const question = ref('Jste spokojeni s aktuální vládou?')
  const choiceA_name = ref('ANO')
  const choiceB_name = ref('NE')
  const choiceA_percent = ref(0)
  const choiceB_percent = ref(0)
  const totalVotesCount = ref(0)

  return {
    question,
    choiceA_name,
    choiceB_name,
    choiceA_percent,
    choiceB_percent,
    totalVotesCount,
  }
})
