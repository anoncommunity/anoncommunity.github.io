/* global $
          infoSection
          setElementValue
          nFormat
*/

console.log('last_update.js')

var coinfullname = 'anon'

infoSection.last_update =
{
  immediate: function () {
    getLastUpdate()
  },
  delay: function (time) {
    setTimeout(getLastUpdate, time)
  },
  repeat: function (time) {
    setInterval(getLastUpdate, time)
  },
  default: function (time) {
    setInterval(getLastUpdate, time)
  }
}

function getLastUpdate () {
  // console.log('getLastUpdate')
  $.get('https://api.coinmarketcap.com/v1/ticker/bitcoin/').then(response => {
    var btcUsd1h = previousPrice(parseFloat(response[0].price_usd), parseFloat(response[0].percent_change_1h))
    var btcUsd24h = previousPrice(parseFloat(response[0].price_usd), parseFloat(response[0].percent_change_24h))
    var btcUsd7d = previousPrice(parseFloat(response[0].price_usd), parseFloat(response[0].percent_change_7d))

    $.get('https://api.coinmarketcap.com/v1/ticker/' + coinfullname + '/').then(response => {
      console.log('*** coinmarketcap response ***')
      calculatePercent(
        '1h',
        parseFloat(response[0].price_usd),
        parseFloat(response[0].price_btc),
        btcUsd1h,
        parseFloat(response[0].percent_change_1h)
      )

      calculatePercent(
        '24h',
        parseFloat(response[0].price_usd),
        parseFloat(response[0].price_btc),
        btcUsd24h,
        parseFloat(response[0].percent_change_24h)
      )

      calculatePercent(
        '7d',
        parseFloat(response[0].price_usd),
        parseFloat(response[0].price_btc),
        btcUsd7d,
        parseFloat(response[0].percent_change_7d)
      )

      setElementValue('last_update_local', new Date().toTimeString().split(' ')[0])
      setElementValue('last_update_utc', new Date().toUTCString().split(' ')[4] + ' UTC')

      setElementValue('price_usd', '$' + nFormat(response[0].price_usd, 2, true))
      setElementValue('price_btc', nFormat(response[0].price_btc, 8, true) + ' BTC')

      setElementValue('market_cap_usd', nFormat(response[0].market_cap_usd, 0, true))

      setElementValue('rank', nFormat(response[0].rank, 0, true))
      setElementValue('marketcap', nFormat(response[0].market_cap_usd, 0, true))
      setElementValue('available_supply', nFormat(response[0].available_supply, 0, true))
      setElementValue('total_supply', nFormat(response[0].total_supply, 0, true))
      setElementValue('max_supply', nFormat(response[0].max_supply, 0, true))
    })
      .catch(error => {
        console.log(error)
      })
  })
    .catch(error => {
      console.log(error)
    })
}

function calculatePercent (interval, currentPriceUsd, currentBtc, previousBtcUsd, percentChangeUsd) {
  var previousZclUsd = previousPrice(parseFloat(currentPriceUsd), parseFloat(percentChangeUsd))
  var zclTmp = previousZclUsd / previousBtcUsd
  var percentChangeBtc = (parseFloat(currentBtc) - zclTmp) / zclTmp * 100

  var signUsd = ''
  var classUsd = 'negative'

  if (percentChangeUsd > 0) {
    signUsd = '+'
    classUsd = 'positive'
  }

  var signBtc = ''
  var classBtc = 'negative'

  if (percentChangeBtc > 0) {
    signBtc = '+'
    classBtc = 'positive'
  }

  setElementValue('percentChange_' + interval, signUsd + nFormat(percentChangeUsd, 2, true) + '%')
  setElementValue('percentChangeBtc_' + interval, signBtc + nFormat(percentChangeBtc, 2, true) + '%')
  $('#percentChange_' + interval).removeClass('positive negative')
  $('#percentChange_' + interval).addClass(classUsd)
  $('#percentChangeBtc_' + interval).removeClass('positive negative')
  $('#percentChangeBtc_' + interval).addClass(classBtc)
}

function previousPrice (currentValue, percentChange) {
  return currentValue / ((100 + percentChange) / 100)
}
