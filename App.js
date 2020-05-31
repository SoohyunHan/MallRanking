import React, { Component, useState, useEffect } from 'react'
import { View, Text, Alert, TextInput, StyleSheet, Button, Linking, ScrollView } from 'react-native'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { cralwer } from './crawl';
global.Buffer = global.Buffer || require('buffer').Buffer


class HomeScreen extends Component {
  static navigationOptions = {
    title: '판매 상품 순위 검색'
  }
  state = {
    mall_name: '',
    search_keyword: '',
    rank: '',
  }
  handleMallName = (text) => {
    this.setState({ mall_name: text })
  }
  handleSearchKeyword = (text) => {
    this.setState({ search_keyword: text })
  }
  CheckTextInput = () => {
    //Handler for the Submit onPress
    if (this.state.mall_name != '') {
      //Check for the Name TextInput
      if (this.state.search_keyword != '') {
        this.props.navigation.push('SearchResult',
          {
            mall_name: this.state.mall_name,
            search_keyword: this.state.search_keyword,
          })
      } else {
        Alert.alert('상품품목명을 입력하세요.');
      }
    } else {
      Alert.alert('판매자명을 입력하세요.');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.outputText}>
          네이버 쇼핑에 판매자가 업로드한 상품품목명과 일치하는 상품 리스트와 해당 상품품목 내 노출 순위를 제공합니다.
        </Text>
        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="판매자명"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={this.handleMallName} />

        <TextInput style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="상품품목명"
          placeholderTextColor="#9a73ef"
          autoCapitalize="none"
          onChangeText={this.handleSearchKeyword} />
        <Button
          title='검색'
          color="#7a42f4"
          onPress={this.CheckTextInput} />
      </View>

    )
  }
}

function crawlExecute(props) {
  props.navigationOptions = {
    title: '검색 결과'
  }
  const mall_data = '';
  const [data, setData] = useState([]);
  var mall_name = props.navigation.state.params.mall_name;
  var search_keyword = props.navigation.state.params.search_keyword;
  const result = async () => {
    var result = await cralwer(mall_name, search_keyword);
    setData(result);
    console.log(data.length);
  }
  useEffect(() => {
    result()
  }, []);
  mall_data_no = (
    <View style={styles.outputText}>
      <Text>
        400위 내, 일치하는 검색 결과가 없습니다.
        </Text>
    </View>
  )
  mall_data_searching = (
    <View style={styles.awaitText}>
      <Text>검색중</Text>
    </View>
  )
  mall_data_yes_header = (
    <View style={styles.small_data_yes_header}>
      <Text style={styles.rank_header}>순위</Text>
      <Text >상품명</Text>
    </View >
  )

  mall_data_yes = data.map((data, i) => (
    <View style={styles.small_data_yes} key={i}>
      <Text style={styles.rank}> {data.rank}</Text>
      <Text style={styles.linkText} onPress={() =>
        Linking.canOpenURL(data.goods_link).then(supported => {
          if (supported) {
            Linking.openURL(data.goods_link)
          } else {
            console.log('Don\'t know how to open URI: ' + data.goods_link);
          }
        })}>  {data.goods_name} </Text>

    </View>
  ))

  return (
    <ScrollView vertical={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingStart: 5,
        paddingEnd: 5,
        paddingTop: 23
      }}>
      {data[0] == undefined && mall_data_searching}
      {data == "NoMatch" && mall_data_no}
      {data[0] == "Matched" && mall_data_yes_header}
      {data != "NoMatch" && mall_data_yes}
    </ScrollView>
  );

}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    SearchResult: {
      screen: crawlExecute,
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#7a42f4',
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: '#333333',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#ffffff'
      }
    }
  },

);

const styles = StyleSheet.create({
  container: {
    paddingTop: 23,
    margin: 10
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1
  },
  small_data_yes: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 15,
    flexDirection: "row",
  }, 
  small_data_yes_header: {
    marginLeft: 10,
    marginRight: 10,
    marginTop : 20,
    marginBottom:-30,
    fontSize: 15,
    flexDirection: "row",
  },
  awaitText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  linkText: {
    color: "#5050FF"
  },
  rank: {
    width: 40,
    height: 40,
  },
  name: {
    paddingLeft: 5,
  },
  rank_header: {
    width: 45,
    height: 45,
  }

})

export default createAppContainer(AppNavigator);
