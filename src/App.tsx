import NeuralPortfolio from './NeuralPortfolio'
import NarutoPortfolio from './NarutoPortfolio'

export default function App() {
  const isAiMode = new URLSearchParams(window.location.search).get('mode') === 'ai'
  return isAiMode ? <NeuralPortfolio /> : <NarutoPortfolio />
}
