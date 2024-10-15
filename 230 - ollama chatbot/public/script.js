const voiceSelect = document.getElementById( 'voice-select' ),

speakText = text => {
  if ( text ) {
    const speech = new SpeechSynthesisUtterance( text ),
    selectedVoice = voiceSelect.value
    speech.voice = window.speechSynthesis.getVoices().find( voice => voice.name === selectedVoice )
    window.speechSynthesis.speak( speech )
  }
  else alert( 'Please enter some text to speak.' )
},

populateVoiceList = () => {
  const voices = window.speechSynthesis.getVoices()
  voiceSelect.innerHTML = ''
  voices.forEach( voice => {
    const option = document.createElement( 'option' )
    option.value = voice.name
    option.textContent = `${ voice.name } (${ voice.lang })`
    voiceSelect.appendChild( option )
  })
}

window.speechSynthesis.onvoiceschanged = populateVoiceList

document
  .getElementById( 'ask-llm-button' )
  .addEventListener( 'click', async () => {
    const llmInput = document.getElementById( 'llm-input' ).value
    
    if ( llmInput ) {
      try {
        const response = await fetch( 'http://localhost:3000/api/ask-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: llmInput }),
        })

        const data = await response.json()
        document.getElementById( 'llm-response' ).innerText = reply = data.reply
        speakText( reply )
      } catch ( err ) {
        console.error( 'Ask query error:', err )
        alert( 'There was an error querying the chatbot.' )
      }
    }
    else alert( 'Please enter an English word or phrase for Ms Trancy to translate.' )
})

document
  .getElementById( 'replay-button' )
  .addEventListener( 'click', () => { if ( reply ) speakText( reply )})

let reply = ''