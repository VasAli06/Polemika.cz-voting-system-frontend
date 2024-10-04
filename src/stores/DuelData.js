import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDuelData = defineStore('DuelData', () => {
    const question = ref('Jste spokojeni s aktuální vládou?')
    const totalVotesCount = ref(0)
    const hosts = [
        {
            hostName: ref('Pavel Novotný'),
            hostPrcent: ref(0),
            img_path: ref("d"),
            host_color: ref("#2EBFA5")
            
        },
        {
            hostName: ref('Marek Prchal'),
            hostPrcent: ref(0),
            img_path: ref("d"),
            host_color: ref("#DEB841")

        }
    ]

    return {
        question,
        hosts,
        totalVotesCount,
    }
})
