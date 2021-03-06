import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView, StackNavigator } from 'react-navigation';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DisplayLatLng from '../components/DisplayLatLng';
import ImageSelector from '../components/ImageSelector';
import ContactInfo from '../components/ContactInfo';
import Fire from '../fire';
import ListSelector from '../components/ListSelector';
import moment from 'moment';

const LocationRoute = {
  LocationScreen: {
    screen: DisplayLatLng,
  },
};

const ViolationRoutes = {
  DumpedItems: {
    name: 'Dumped Items',
  },
  Litter: {
    name: 'Litter',
  },
};

const Routes = {
  ViolationScreen: {
    screen: ListSelector,
    display: 'Violation Type?',
    type: 'violation',
    isSet: false,
    value: null,
    routes: ViolationRoutes,
  },
};

class IllegalDumpingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      additionalDetails: null,
      deviceId: null,
      address: null,
      imageOne: null,
      imageTwo: null,
      imageThree: null,
      location: null,
      publicSwitch: true,
      contactSwitch: false,
      firstName: null,
      lastName: null,
      email: null,
      phone: null,
      dumpingViolation: null,
      recurringProblem: false,
      reportNumber: null,
      coords: null,
      mapSnapshot: null,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: "Illegal Dumping",
      headerStyle: {
        backgroundColor: '#4f4380'
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerLeft: (
        <TouchableOpacity style={{marginLeft: 15}} onPress={() => params.handleCancel()}>
          <Text style={{color: '#f3f3f3', font: 16, fontWeight: 'bold'}}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
      headerRight: (
        [
          params.canSubmit ?
            <TouchableOpacity style={{marginRight: 15}} onPress={() => params.handleSave()} >
              <Text style={{color: '#ffffff', font: 16, fontWeight: 'bold'}}>
                Submit
              </Text>
            </TouchableOpacity> :
            <Text style={{color: '#AAAFB4', font: 16, fontWeight: 'bold', marginRight: 15}}>
              Submit
            </Text>
        ]
      )
    }
  };

  componentDidMount() {
    Fire.auth().onAuthStateChanged((user) => {
      this.setState({
        deviceId: Expo.Constants.deviceId,
        userIsAnon: user.isAnonymous,
        userId: user.uid,
      });
    });
    this.props.navigation.setParams({
      handleSave: this._saveDetails,
      handleCancel: this._clearDetails,
      canSubmit: false,
    });
    this.getLatestIssueId();
  }

  componentWillUnmount() {
    Object.keys(Routes).map((routeName: string) => (
      Routes[routeName].isSet = false
    ));
    Object.keys(Routes).map((routeName: string) => (
      Routes[routeName].value = null
    ));
    this.setState({
      deviceId: null,
      userId: null,
      userIsAnon: null,
      issueId: null,
      additionalDetails: null,
      address: null,
      imageOne: null,
      imageTwo: null,
      imageThree: null,
      location: null,
      publicSwitch: true,
      contactSwitch: false,
      firstName:null,
      lastName: null,
      email: null,
      phone: null,
      dumpingViolation: null,
      recurringProblem: false,
      reportNumber: null,
      coords: null,
      mapSnapshot: null,
    });
  }

  // might be a bug here
  // if there is no query back for some reason, the report number will default to 0
  getLatestIssueId() {
    return Fire.database().ref().child('reports').limitToLast(1).on('value', (snapshot) => {
      snapshot.forEach((child) => {
        this.setState({reportNumber: child.val().reportNumber});
      });
      if (!snapshot) {
        this.setState({reportNumber: 0});
      }

    });
  }

  writeNewReport() {
    reportNum = this.state.reportNumber + 1;

    // A report entry.
    let reportData = {
      title: 'Illegal Dumping',
      type: 'Sanitation',
      deviceId: this.state.deviceId,
      coords: this.state.coords,
      dateCreated: moment().format(),
      uid: Fire.auth().currentUser.uid,
      userIsAnon: this.state.userIsAnon,
      reportNumber: reportNum,
      additionalDetails: this.state.additionalDetails,
      address: this.state.address,
      imageOne: this.state.imageOne,
      imageTwo: this.state.imageTwo,
      imageThree: this.state.imageThree,
      location: this.state.location,
      submitPublicly: this.state.publicSwitch,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      phone: this.state.phone,
      problemDetails: {
        'Dumping Violation': this.state.dumpingViolation,
        'Recurring Problem': this.state.recurringProblem,
      },
      status: 'submitted',
      mapSnapshot: this.state.mapSnapshot,
    };

    // Get a key for a new Post.
    let newReportKey = Fire.database().ref().child('reports').push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    updates['/reports/' + newReportKey] = reportData;
    updates['/user-reports/' + this.state.userId + '/' + newReportKey] = reportData;

    return Fire.database().ref().update(updates);
  }

  _clearDetails = () => {
    Alert.alert(
      'Exiting this form will delete thie information you have entered. Are you sure you want to exit?',
      '',
      [
        {text: 'Dont Exit', onPress: () => { }, style: 'cancel'},
        {text: 'Exit', onPress: () => { this.props.navigation.goBack(null) }},
      ],
      { cancelable: false }
    );
  };

  _saveDetails = () => {
    if (this.state.location) {
      this.writeNewReport();
      this.props.navigation.navigate('ConfirmReport', { reportId: this.state.reportNumber + 1 });
    }
  };

  _getLocation = (address, coords, mapSnapshot) => {
    if (address) {
      let addressString = address[0].name.toString() + ", " + address[0].city.toString();
      this.setState({
        location: address,
        address: addressString,
        coords: coords,
        mapSnapshot: mapSnapshot,
      });
      this.props.navigation.setParams({
        canSubmit: true,
      });
      this.props.navigation.goBack(null);
    }
  };

  _getContactInfo = (value, type) => {
    if (type === "firstName") {
      this.setState({ firstName: value });
    } else if (type === "lastName") {
      this.setState({ lastName: value });
    } else if (type === "email") {
      this.setState({ email: value });
    } else {
      this.setState({ phone: value });
    }
  };

  _getValue = (value, type) => {
    if (type === 'violation') {
      Object.keys(Routes).map((routeName: string, index) => (
        Routes['ViolationScreen'].isSet = true
      ));
      Object.keys(Routes).map((routeName: string) => (
        Routes['ViolationScreen'].value = value
      ));
      this.setState({dumpingViolation: value});
    }
    this.props.navigation.goBack(null);
  };

  _onPublicSwitchChange = () => {
    this.setState({ publicSwitch: !this.state.publicSwitch });
  };

  _onContactSwitchChange = () => {
    if (this.state.contactSwitch) {
      this.setState({
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
      })
    }
    this.setState({ contactSwitch: !this.state.contactSwitch });
  };

  _onRecurringSwitchChange = () => {
    this.setState({ recurringProblem: !this.state.recurringProblem });
  };

  _deleteImage = (index) => {
    if (index === 1) {
      this.setState({ imageOne: null });
    } else if (index === 2) {
      this.setState({ imageTwo: null });
    } else {
      this.setState({ imageThree: null });
    }
  };

  _getImage = (image, index) => {
    if (index === 1) {
      this.setState({ imageOne: image });
    } else if (index === 2) {
      this.setState({ imageTwo: image });
    } else {
      this.setState({ imageThree: image });
    }
  };

  render() {
    const styles = StyleSheet.create({
      item: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      submitItem: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      submitPublicItem: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      itemContainer: {
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
      },
      title: {
        fontSize: 20,
        flex: 1,
        color: '#444',
        alignSelf: 'flex-start'
      },
      infoTextField: {
        height: 40,
        backgroundColor: 'white',
        fontSize: 16,
        paddingLeft: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#ddd',
      }
    });

    let isAddress = false;
    if (!this.state.address) {
      isAddress = true;
    }

    return(
      <KeyboardAwareScrollView
        enableOnAndroid="true"
        contentContainerStyle={{ flexGrow: 1 }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled
      >
        <ImageSelector saveImage={this._getImage} removeImage={this._deleteImage}/>
        {Object.keys(LocationRoute).map((routeName: string) => (
          <TouchableOpacity
            key={routeName}
            onPress={() => {
              const { path, params, screen } = LocationRoute[routeName];
              const { router } = screen;
              const action = path && router.getActionForPathAndParams(path, params);
              this.props.navigation.navigate(routeName, {saveLocation: this._getLocation}, action);
            }}
          >
            <SafeAreaView
              style={styles.itemContainer}
              forceInset={{ vertical: 'never' }}
            >
              <View style={styles.item}>
                <Text style={styles.title}>
                  {!isAddress ? this.state.address : 'Tap to get address'}
                </Text>
                <Ionicon name="ios-arrow-forward" style={{paddingHorizontal: 3}} color="#BDBDBD" size={22}/>
              </View>
            </SafeAreaView>
          </TouchableOpacity>
        ))}
        <View style={{marginTop: 10}}>
          {Object.keys(Routes).map((routeName: string) => (
            <TouchableOpacity
              key={routeName}
              onPress={() => {
                const { path, params, screen } = Routes[routeName];
                const { router } = screen;
                const action = path && router.getActionForPathAndParams(path, params);
                this.props.navigation.navigate(
                  routeName,
                  {
                    saveValues: this._getValue,
                    title: Routes[routeName].display,
                    routes: Routes[routeName].routes,
                    type: Routes[routeName].type
                  },
                  action,
                );
              }}
            >
              <SafeAreaView
                style={[styles.itemContainer]}
                forceInset={{ vertical: 'never' }}
              >
                <View style={styles.submitItem}>
                  <Text style={styles.title}>
                    {Routes[routeName].isSet ? Routes[routeName].value : Routes[routeName].display}
                  </Text>
                  <Ionicon name="ios-arrow-forward" style={{paddingHorizontal: 3}} color="#BDBDBD" size={22}/>
                </View>
              </SafeAreaView>
            </TouchableOpacity>
          ))}
        </View>
        <SafeAreaView
          style={[styles.itemContainer, {marginTop: 10}]}
          forceInset={{ vertical: 'never' }}
        >
          <View style={styles.submitPublicItem}>
            <Text style={styles.title}>
              Recurring problem?
            </Text>
            <Switch
              onValueChange={this._onRecurringSwitchChange}
              value={this.state.recurringProblem}
            />
          </View>
        </SafeAreaView>
        <TextInput
          style={{height: 40, backgroundColor: 'white', fontSize: 16, marginBottom: 10, paddingHorizontal: 20, paddingTop: 10}}
          onChangeText={(additionalDetails) => this.setState({additionalDetails})}
          placeholder="Describe type, quantity, and location (optional)"
          value={this.state.additionalDetails}
          multiline={true}
          underlineColorAndroid="#fff"
        />
        <SafeAreaView
          style={styles.itemContainer}
          forceInset={{ vertical: 'never' }}
        >
          <View style={styles.submitPublicItem}>
            <Text style={styles.title}>
              Submit publicly?
            </Text>
            <Switch
              style={{ }}
              onValueChange={this._onPublicSwitchChange}
              value={this.state.publicSwitch}
            />
          </View>
        </SafeAreaView>
        <SafeAreaView
          style={[styles.itemContainer,{marginTop: 10}]}
          forceInset={{ vertical: 'never' }}
        >
          <View style={styles.submitPublicItem}>
            <Text style={styles.title}>
              Include Contact Info?
            </Text>
            <Switch
              onValueChange={this._onContactSwitchChange}
              value={this.state.contactSwitch}
            />
          </View>
        </SafeAreaView>
        <SafeAreaView>
          { this.state.contactSwitch ? <ContactInfo saveContactInfo={this._getContactInfo}/> : <Text/> }
        </SafeAreaView>
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    );
  }
}

const Stack = StackNavigator(
  {
    ...LocationRoute,
    ...Routes,
    Index: {
      screen: IllegalDumpingScreen,
    },
  },
  {
    initialRouteName: 'Index',
  }
);

export default Stack;