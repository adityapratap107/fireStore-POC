import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [newData, setNewData] = useState([]);
  const [hideText, setHideText] = useState(false);
  const [myItemData, setMyItemData] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [doneShow, setDoneShow] = useState(false);

  const onPushData = () => {
    var match = 0;
    for (let i = 1; i <= 50000; i++) {
      if (newData.length === 0) {
        if (i % 3 === 0) {
          firestore()
            .collection('stores')
            .add({
              storeId: i,
              userID: 2,
              storeName: 'Store ' + i,
              storeFormattedAddress: 'North Hill, Location ' + i,
            })
            .then(() => {
              console.log('data pushed on firestore');
            });
        } else {
          firestore()
            .collection('stores')
            .add({
              storeId: i,
              userID: 1,
              storeName: 'Store ' + i,
              storeFormattedAddress: 'North Hill, Location ' + i,
            })
            .then(() => {
              console.log('data pushed on firestore');
            });
        }
      } else {
        newData.forEach(item => {
          if (item._data.storeId === i) {
            match = 1;
          }
        });
        if (match === 0) {
          if (i % 3 === 0) {
            firestore()
              .collection('stores')
              .add({
                storeId: i,
                userID: 2,
                storeName: 'Store ' + i,
                storeFormattedAddress: 'North Hill, Location ' + i,
              })
              .then(() => {
                console.log('data pushed on firestore');
              });
          } else {
            firestore()
              .collection('stores')
              .add({
                storeId: i,
                userID: 1,
                storeName: 'Store ' + i,
                storeFormattedAddress: 'North Hill, Location ' + i,
              })
              .then(() => {
                console.log('data pushed on firestore');
              });
          }
        }
      }
    }
  };

  useEffect(() => {
    firestore()
      .collection('stores')
      .where('userID', '==', 2)
      // .orderBy('storeId', 'asc')
      .onSnapshot(documentSnapshot => {
        try {
          // console.log('where#', documentSnapshot.docs);
          setNewData(documentSnapshot.docs);
        } catch (e) {
          console.log('Error', e);
        }
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('stores')
      .get()
      .then(querySnapshot => {
        console.log('Size', querySnapshot.size);
      });
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <TouchableOpacity
        onPress={onPushData}
        style={{alignItems: 'center', marginTop: 10}}>
        <Text
          style={{
            color: '#fff',
            fontWeight: '800',
            backgroundColor: 'grey',
            width: 140,
            padding: 12,
            textAlign: 'center',
          }}>
          Click to push data
        </Text>
      </TouchableOpacity>
      <FlatList
        data={newData}
        style={{marginTop: 20}}
        renderItem={({item, index}) => {
          return (
            <View>
              <View
                style={{
                  backgroundColor: '#e6dfcf',
                  marginTop: 20,
                  height: 180,
                  marginHorizontal: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  padding: 20,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{color: '#000', fontWeight: '800', fontSize: 18}}>
                    {item._data.storeName}
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      setMyItemData(item._data);
                      setHideText(!hideText);
                    }}>
                    <Image
                      source={require('./src/assets/images/edit.png')}
                      style={{
                        height: 20,
                        width: 20,
                        marginHorizontal: 12,
                        top: Platform.OS === 'android' ? 2 : 0,
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {hideText && item._data.storeId === myItemData.storeId ? (
                  <View style={{flexDirection: 'row', paddingVertical: 12}}>
                    <TextInput
                      placeholder="Edit Store name"
                      placeholderTextColor={'grey'}
                      style={{color: '#000', fontSize: 15}}
                      onChangeText={val => {
                        setStoreName(val);
                        if (val.trim().length === 0) {
                          setDoneShow(false);
                        } else {
                          setDoneShow(true);
                        }
                      }}
                    />
                    {doneShow && (
                      <TouchableOpacity
                        onPress={async () => {
                          setHideText(false);
                          setDoneShow(false);
                          firestore()
                            .collection('stores')
                            .get()
                            .then(querySnapshot => {
                              querySnapshot.forEach(documentSnapshot => {
                                if (
                                  documentSnapshot.data().storeId ===
                                  myItemData.storeId
                                ) {
                                  firestore()
                                    .collection('stores')
                                    .doc(documentSnapshot.id)
                                    .update({storeName: storeName})
                                    .then(() => {
                                      console.log('updated');
                                    });
                                }
                              });
                            });
                        }}>
                        <Image
                          source={require('./src/assets/images/check.png')}
                          style={{
                            height: 20,
                            width: 20,
                            marginLeft: 12,
                            top: Platform.OS === 'android' ? 12 : 0,
                          }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
                <Text style={{color: '#000', fontSize: 16, marginTop: 12}}>
                  {item._data.storeFormattedAddress}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default App;
