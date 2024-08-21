import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {theme} from './color';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [work, setWork] = useState(true);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const initialTodos = await loadTodos("todos");
      const initialTravels = await loadTodos("travels");
      setTodos(initialTodos);
      setTravels(initialTravels);
    };
    loadData();
  }, []);

  function deleteData(id) {
    if (work) {
      const newTodos = todos.filter((item) => item.id !== id);
      setTodos(newTodos);
      saveTodos("todos", newTodos); // 삭제 후 상태 저장
    } else {
      const newTravels = travels.filter((item) => item.id !== id);
      setTravels(newTravels);
      saveTodos("travels", newTravels); // 삭제 후 상태 저장
    }
    alert("삭제 되었습니다.");
  }

  const loadTodos = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key); // AsyncStorage에서 JSON 문자열 가져오기
      return jsonValue != null ? JSON.parse(jsonValue) : []; // JSON 문자열을 배열로 변환
    } catch (e) {
      console.log('Failed to fetch the data from storage');
      return []; // 오류 발생 시 빈 배열 반환
    }
  };

  const saveTodos = async (key, array) => {
    try {
      const jsonValue = JSON.stringify(array); // 배열을 JSON 문자열로 변환
      await AsyncStorage.setItem(key, jsonValue); // AsyncStorage에 저장
      console.log('Data successfully saved!');
    } catch (e) {
      console.log('Failed to save the data to the storage');
    }
  };

  function addTodo() {
    if(text===''){
      return;
    }
    if(work){
      const todo = {
        id: Date.now(),
        text,
      }
      const newTodos = [...todos, todo];
      setTodos(newTodos);
      saveTodos("todos", newTodos);
    }
    else {
      const travel = {
        id: Date.now(),
        text,
      }
      const newTravles = [...travels, travel];
      setTravels(newTravles);
      saveTodos("travels", newTravles);
    }
    
    alert(text);
    setText('');
  }
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>setWork(true)}>
          <Text style={{...styles.btnText, color: work?"white":theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setWork(false)}>
          <Text style={{...styles.btnText, color: work?theme.grey:"white"}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textWrapper}>
        <TextInput 
        value={text}
        onChangeText={setText}
        onSubmitEditing={addTodo}
        style={styles.text} 
        placeholder={work?"할 일을 입력하세요.":"갈 여행지를 입력하세요."} />
      </View>
      <ScrollView style={styles.todoWrapper}>
        {
          work?(
            todos.map((item, index)=>(
              <View key={item.id} style={styles.todo}>
                <Text style={styles.todoText}>{item.text}</Text>
                <View style={styles.other}>
                  <TouchableOpacity>
                    <Text style={styles.others}>✅</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>deleteData(item.id)}>
                    <Text style={styles.others}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
          ))):(
            travels.map((item, index)=>(
              <View key={item.id} style={styles.todo}>
                <Text style={styles.todoText}>{item.text}</Text>
                <View style={styles.other}>
                  <TouchableOpacity>
                    <Text style={styles.others}>✅</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>deleteData(item.id)}>
                    <Text style={styles.others}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
          )))
          // <View style={styles.todo}>
          //   <Text style={styles.todoText}>학교</Text>
          // </View>
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.back,
    paddingHorizontal: 20
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
  },
  btnText: {
    color: "white",
    fontSize: 44,
    fontWeight: "600",
  },
  textWrapper: {
    alignItems: "center"
  },  
  text: {
    width: "100%",
    minHeight: 40,
    backgroundColor: "white",
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 10,
    fontSize: 18,
    color: "black"
  },
  todoWrapper: {

  },
  todo: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#666",
    padding: 20,
    color: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  todoText: {
    color: "white",
    fontSize: 30,
  },
  other: {
    flexDirection: "row",
    gap: 10,
  },
  others: {
    fontSize: 20
  }
});