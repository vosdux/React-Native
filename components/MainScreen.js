import React, { useState, useEffect, Component } from 'react';
import { Content, Form, Picker, Button, Left, Right, Body, Icon, Text, View } from 'native-base';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedFrom: 'ca-ES',
      selectedTo: 'ru-RU',
      isRecording: false,
      result: [],
      translated: '',
      isTranslated: false,
      isError: false,
      languages: [
        { value: 'fr-FR', label: 'Французкий' },
        { value: 'en-US', label: 'Английский' },
        { value: 'ca-ES', label: 'Испанский' },
        { value: 'ru-RU', label: 'Русский' },
      ],
      phrases: [
        { 'ru-RU': 'помогите мне', 'en-US': 'help me', 'ca-ES': 'ademe', 'fr-FR': 'aide-moi' },
        { 'ru-RU': 'помогите мне пожалуйста', 'en-US': 'help me please', 'ca-ES': 'Ayudame por favor', 'fr-FR': "aide moi s'il te plait" },
        { 'ru-RU': 'кажется у меня сломана нога', 'en-US': 'It seems my leg is broken', 'ca-ES': 'Parece que mi pierna está rota', 'fr-FR': "semble que ma jambe cassée" },
        { 'ru-RU': 'я сломал ногу', 'en-US': 'I broke my leg', 'ca-ES': 'me rompi la pierna', 'fr-FR': "Je me suis cassé la jambe" },
        { 'ru-RU': 'я сломал руку', 'en-US': 'I broke my arm', 'ca-ES': 'me rompi el brazo', 'fr-FR': "je me suis cassé le bras" },
        { 'ru-RU': 'я ударился головой', 'en-US': 'I banged my head', 'ca-ES': 'Me golpee la cabeza', 'fr-FR': "J'ai frappé ma tête" },
        { 'ru-RU': 'этот камень меня придавил', 'en-US': 'this rock crushed me', 'ca-ES': 'esta piedra me aplasto', 'fr-FR': "cette pierre m'a écrasé" },
        { 'ru-RU': 'я упал', 'en-US': 'I fell', 'ca-ES': 'me cai', 'fr-FR': "je suis tombé" },
        { 'ru-RU': 'там бомба', 'en-US': "There's a bomb", 'ca-ES': 'Hay una bomba', 'fr-FR': "Il y a une bombe" },
        { 'ru-RU': 'я ничего не помню', 'en-US': "I don't remember anything", 'ca-ES': 'no recuerdo nada', 'fr-FR': "je ne me souviens de rien" },
      ],
      apiKey: 'trnsl.1.1.20200425T095551Z.3219724ca7e50373.8d6fad0c5afc2f9068be5f6579fc7834cf07ca3e'
    };
    Voice.onSpeechStart = this.onSpeechStartHandler;
    Voice.onSpeechEnd = this.onSpeechEndHandler;
    Voice.onSpeechError = this.onErrorHandler;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentDidMount() {
    Tts.setDefaultLanguage('ru-RU');
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  // supported = async () => {
  //   try {
  //     const locales = await Tts.voices();
  //     const nonInternetLocales = locales.filter(elem => !elem.networkConnectionRequired && elem.language === 'ru-RU');
  //     console.log(nonInternetLocales);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // getLangs = async () => {
  //   try {
  //     const { apiKey } = this.state;
  //     const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/getLangs?key=${apiKey}&ui=en`, { method: 'POST' });
  //     if (response.ok) { // если HTTP-статус в диапазоне 200-299
  //       // получаем тело ответа
  //       let json = await response.json();
  //       console.log(json)
  //     }
  //   } catch (error) {

  //   }
  // }

  // getTranslate = async () => {
  //   try {
  //     const { apiKey, result } = this.state;
  //     const response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&lang=ru&text=${result[0]}`, {
  //       method: 'post',
  //     })
  //     if (response.ok) { // если HTTP-статус в диапазоне 200-299
  //       // получаем тело ответа
  //       console.log('ok');
  //       let json = await response.json();
  //       this.setState({ translated: json.text[0] });
  //     }
  //   } catch (error) {
  //     console.log('error', error.message)
  //   }
  // }

  getTranslate = () => {
    const { result, phrases, selectedFrom, selectedTo } = this.state;
    const translatedItem = phrases.find(elem => elem[selectedFrom].toLowerCase() === result[0].toLowerCase());
    if (translatedItem) {
      this.setState({ translated: translatedItem[selectedTo], isTranslated: true, isError: false });
    } else {
      this.setState({ isError: true, isTranslated: false });
    }
  }

  speak = async () => {
    try {
      const { translated, selectedTo } = this.state;
      await Tts.setDefaultLanguage(selectedTo);
      await Tts.speak(translated, {
        androidParams: {
          KEY_PARAM_PAN: -1,
          KEY_PARAM_VOLUME: 0.5,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    } catch (error) {
      console.log('err', error);
    }
  }

  onSpeechResults = (e) => {
    if (e.value.length) {
      this.setState({ result: e.value }, () => this.getTranslate());
    } else {
      this.setState({ isTranslated: false, isError: true })
    }

  }

  onSpeechStartHandler = (e) => {
    this.setState({ isRecording: true });
  }

  onSpeechEndHandler = () => {
    this.setState({ isRecording: false });
  }

  onErrorHandler = () => {
    this.setState({
      isError: true,
      isTranslated: false,
      isRecording: false
    })
  }

  onValueChange = (name, value) => {
    this.stopRecording();
    this.setState({
      [name]: value,
      isError: false,
      isTranslated: false,
      isRecording: false,
    });
  }

  startRecording = async () => {
    try {
      const { selectedFrom } = this.state;
      const isAvailable = await Voice.isAvailable();
      if (isAvailable) {
        await Voice.start(selectedFrom);
      }
    } catch (error) {
      console.log(error);
      this.setState({ isRecording: false });
    }
  }

  stopRecording = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.log(error.message);
    }
  }

  renderTranslate = () => {
    const { result, translated, selectedFrom, selectedTo, languages } = this.state;
    const from = languages.find(elem => elem.value === selectedFrom);
    const to = languages.find(elem => elem.value === selectedTo);
    return (
      <>
        <Text style={{ textAlign: "center", fontSize: 20, marginTop: 10 }}>{from.label}:</Text>
        <Text>{result[0]}</Text>
        <Text style={{ textAlign: "center", fontSize: 20, marginTop: 10 }}>{to.label}:</Text>
        <Text>{translated}</Text>
        <Button block Primary onPress={this.speak} style={{ marginTop: 20 }}>
          <Text>Воспроизвести</Text>
        </Button>
      </>
    )
  }

  renderError = () => {
    const { result } = this.state;
    console.log(result.length)
    return (
      <>
        <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>Ошибка перевода!</Text>
        {result.length ? <>
          <Text>Возможные варианты фразы:</Text>
          {result.map(item => <Text>{item}</Text>)}
        </> : <Text></Text>}
      </>
    )
  }

  render() {
    const { selectedFrom, selectedTo, isRecording, languages, result, translated, isError, isTranslated } = this.state;
    return (
      <Content contentContainerStyle={{ padding: 20 }}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>Перевод с:</Text>
        <Form>
          <Picker
            note
            mode="dropdown"
            style={{ width: '100%', marginTop: 5 }}
            selectedValue={selectedFrom}
            onValueChange={(value) => this.onValueChange('selectedFrom', value)}
          >
            {languages.map(item => <Picker.Item label={item.label} value={item.value} key={item.value} />)}
          </Picker>
        </Form>
        <Text style={{ textAlign: "center", fontSize: 20 }}>Перевод на:</Text>
        <Form>
          <Picker
            note
            mode="dropdown"
            style={{ width: '100%', marginTop: 5 }}
            selectedValue={selectedTo}
            onValueChange={(value) => this.onValueChange('selectedTo', value)}
          >
            {languages.map(item => <Picker.Item label={item.label} value={item.value} key={item.value} />)}
          </Picker>
        </Form>
        {!isRecording ? <Button iconLeft block Primary onPress={this.startRecording}>
          <Icon name='microphone' />
        </Button> : <Button iconLeft block danger onPress={this.stopRecording}>
            <Icon name='microphone' />
          </Button>}
        {isTranslated ? this.renderTranslate() : <Text></Text>}
        {isError && this.renderError()}
      </Content>

    )
  }

}

export default MainScreen;
