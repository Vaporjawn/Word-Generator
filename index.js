const phonemes = {
  "consonant_sounds": [
    ["b", "bb"],
    ["d", "dd", "ed"],
    ["f", "ph"],
    ["g", "gg"],
    ["h"],
    ["j", "g", "ge", "dge"],
    ["c", "k", "ck", "ch", "cc", "que"],
    ["l", "ll"],
    ["m", "mm", "mb"],
    ["n", "nn", "kn", "gn"],
    ["p", "pp"],
    ["r", "rr", "wr"],
    ["s", "se", "ss", "c", "ce", "sc"],
    ["t", "tt", "ed"],
    ["v", "ve"],
    ["w"],
    ["y", "i"],
    ["z", "zz", "ze", "s", "se", "x"]
  ],
  "consonant_diagraphs": [
    ["th"],
    ["ng", "n"],
    ["sh", "ss", "ch", "ti", "ci"],
    ["ch", "tch"],
    ["ge", "s"],
    ["wh"]
  ],
  "short_vowel_sounds": [
    ["a", "au"],
    ["e", "ea"],
    ["i"],
    ["o", "a", "au", "aw", "ough"],
    ["u", "o"]
  ],
  "long_vowel_sounds": [
    ["a", "ay", "ai", "ey", "ei"],
    ["e", "ea", "ee", "ey", "ie", "y"],
    ["i", "igh", "y", "ie"],
    ["o", "oa", "ou", "ow"],
    ["u", "ew"]

  ],
  "other_vowel_sounds": [
    ["oo", "u", "oul"],
    ["oo", "u"]
  ],
  "vowel_dipthongs": [
    ["ow", "ou"],
    ["oi", "oy"]
  ],
  "vowel_sounds_influnced_by_r": [
    ["ar"],
    ["air", "ear", "are"],
    ["irr", "ere", "eer"],
    ["or", "ore", "oor"],
    ["ur", "ir", "er", "ear", "or", "ar"]
  ]
};

function wordGenerator(max_word_len) {
  // This function makes "words" from sounds
  let word_length = Math.floor((Math.random() * max_word_len) + 1);
  let res = "";

  let types = Object.keys(phonemes);
  //console.log(types[Math.floor(Math.random() * types.length)]);


  for (let i = 0; i < word_length; i++) {
    let current_type = types[Math.floor(Math.random() * types.length)];
    let phoneme_group = phonemes[current_type];

    let pg_N = phoneme_group.length;
    let sound_group = phoneme_group[Math.floor(Math.random() * pg_N)];
    let sg_N = sound_group.length;
    let sound = sound_group[Math.floor(Math.random() * sg_N)];
    sound = sound_group[0];

    res += (sound);
  }

  return res;
}

function sentenceGenerator(max_sentence_len = 15, max_word_len = 4) {
  // This function makes "sentences" from "words"

  let sentence_length = Math.floor((Math.random() * max_sentence_len) + 1);
  sentence_length = max_sentence_len;
  let res = "";

  for (let i = 0; i < sentence_length; i++) res += wordGenerator(max_word_len) + " ";

  return res;
}

var synth = window.speechSynthesis;

var inputForm = document.querySelector('#speech_form');
var inputTxt = document.querySelector('#speech_input');
var voiceSelect = document.querySelector('#voice_select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = synth.getVoices();

var generatorForm = document.querySelector('#generator_form');
var wordLength = document.querySelector('#word_length');
var sentenceLength = document.querySelector('#sentence_length');

function populateVoiceList() {
  voices = synth.getVoices().sort(function (a, b) {
      const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
      if ( aname < bname ) return -1;
      else if ( aname == bname ) return 0;
      else return +1;
  });
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  voiceSelect.innerHTML = '';
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(){
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (inputTxt.value !== '') {
    var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);
  }
}

inputForm.onsubmit = function(event) {
  event.preventDefault();

  speak();

  inputTxt.blur();
}

generatorForm.onsubmit = function(event) {
  event.preventDefault();

  let text = sentenceGenerator(parseInt(sentenceLength.value), parseInt(wordLength.value));
  inputTxt.value = text;
}


pitch.onchange = function() {
  pitchValue.textContent = pitch.value;
}

rate.onchange = function() {
  rateValue.textContent = rate.value;
}

voiceSelect.onchange = function(){
  //speak();
}

console.log(phonemes);
