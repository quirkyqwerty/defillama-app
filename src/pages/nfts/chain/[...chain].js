import NFTDashboardPage from '../../../components/NFTDashboardPage'
import { GeneralLayout } from '../../../layout'
import { capitalizeFirstLetter } from '../../../utils'
import {
  getNFTChainChartData,
  getNFTChainsData,
  getNFTCollectionsByChain,
  revalidate
} from '../../../utils/dataApi'

export async function getStaticProps({
  params: {
    chain: [chainName]
  }
}) {
  const collections = await getNFTCollectionsByChain(chainName)
  const chartData = await getNFTChainChartData(chainName)
  const chainData = await getNFTChainsData()
  const { totalVolumeUSD, dailyVolumeUSD } = chainData.find(c => c.chain === chainName) || {
    totalVolumeUSD: 0,
    dailyVolumeUSD: 0
  }

  let dailyChange = 0
  if (chartData.length > 1) {
    dailyChange =
      ((chartData[chartData.length - 1].dailyVolume - chartData[chartData.length - 2].dailyVolume) /
        chartData[chartData.length - 2].dailyVolume) *
      100
  }

  return {
    props: {
      chain: chainName,
      totalVolumeUSD,
      dailyVolumeUSD,
      dailyChange,
      collections,
      chart: chartData
    },
    revalidate: revalidate()
  }
}

export async function getStaticPaths() {
  const chainData = await getNFTChainsData()

  const paths = chainData.map(({ chain: chainName }) => ({
    params: { chain: [chainName] }
  }))

  return { paths, fallback: 'blocking' }
}

export default function Chain({ chain, ...props }) {
  return (
    <GeneralLayout title={`${capitalizeFirstLetter(chain)} Total Volume - DefiLlama`}>
      <NFTDashboardPage chain={chain} {...props} />
    </GeneralLayout>
  )
}
