import { create } from 'zustand'

const useCounterStore = create(set => ({
    good: 0,
    neutral: 0,
    bad: 0,
    all: 0,
    actions: {
        plusGood: () => set(state => ({
            good: state.good + 1,
            all: state.all + 1,
        })),
        plusNeutral: () => set(state => ({
            neutral: state.neutral + 1,
            all: state.all + 1,
        })),
        plusBad: () => set(state => ({
            bad: state.bad + 1,
            all: state.all + 1,
        })),
    }
}))

export const useCounter = () => useCounterStore(state => state)
export const useCounterControls = () => useCounterStore(state => state.actions)