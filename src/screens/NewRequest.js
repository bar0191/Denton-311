import React from 'react';
import { Platform, StyleSheet, Text, View, KeyboardAvoidingView,
  ScrollView, TouchableOpacity, Button, Image, TextInput} from 'react-native';
import { ScreenOrientation } from 'expo';
import { SafeAreaView, StackNavigator, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import DeadAnimalScreen from './DeadAnimal';
import FoundAnimalScreen from './FoundAnimal';
import LooseAnimalScreen from './LooseAnimal';
import PotholeScreen from './Pothole';
import StreetSignScreen from './StreetSign';
import TrafficLightScreen from './TrafficLight';
import StreetLightScreen from './StreetLight';
import BrokenSidewalkScreen from './BrokenSidewalk';
import FireHydrantScreen from './FireHydrant';
import AbandonedVehicleScreen from './AbandonedVehicle';
import BlockedDrivewayScreen from './BlockedDriveway';
import IllegalParkingScreen from './IllegalParking';
import ParkingMeterScreen from './ParkingMeter';
import DamagedTreeScreen from './DamagedTree';
import IllegalDumpingScreen from './IllegalDumping';
import GraffitiScreen from './Graffiti';
import OtherScreen from './Other';

const Animals = {
  DeadAnimal: {
    name: 'Dead Animal',
    image: require('../../assets/images/cow-skull.png'),
    screen: DeadAnimalScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  FoundAnimal: {
    name: 'Found Animal',
    image: require('../../assets/images/found-animal.png'),
    screen: FoundAnimalScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  LooseAnimal: {
    name: 'Loose Animal',
    image: require('../../assets/images/running-dog-silhouette.png'),
    screen: LooseAnimalScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
};

const StreetsSidewalks = {
  Pothole: {
    name: 'Pothole',
    image: require('../../assets/images/pothole.png'),
    screen: PotholeScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  StreetSign: {
    name: 'Street Sign',
    image: require('../../assets/images/one-way-street-signal.png'),
    screen: StreetSignScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  TrafficLight: {
    name: 'Traffic Light',
    image: require('../../assets/images/traffic-light.png'),
    screen: TrafficLightScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),

  },
  StreetLight: {
    name: 'Street Light',
    image: require('../../assets/images/lamp-post.png'),
    screen: StreetLightScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  BrokenSidewalk: {
    name: 'Broken Sidewalk',
    image: require('../../assets/images/crossing.png'),
    screen: BrokenSidewalkScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  FireHydrant: {
    name: 'Fire Hydrant',
    image: require('../../assets/images/fire-hydrant.png'),
    screen: FireHydrantScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
};

const ParkingVehicles = {
  AbandonedVehicle: {
    name: 'Abandoned Vehicle',
    image: require('../../assets/images/abandoned.png'),
    screen: AbandonedVehicleScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  BlockedDriveway: {
    name: 'Blocked Driveway',
    image: require('../../assets/images/blocked-sign.png'),
    screen: BlockedDrivewayScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  IllegalParking: {
    name: 'Illegal Parking',
    image: require('../../assets/images/no-parking-sign.png'),
    screen: IllegalParkingScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  ParkingMeter: {
    name: 'Parking Meter',
    image: require('../../assets/images/parking-meter.png'),
    screen: ParkingMeterScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
};

const TreesPark = {
  DamagedTree: {
    name: 'Damaged Tree',
    image: require('../../assets/images/tree-silhouette.png'),
    screen: DamagedTreeScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
};

const Sanitation = {
  IllegalDumping: {
    name: 'Illegal Dumping',
    image: require('../../assets/images/trash.png'),
    screen: IllegalDumpingScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  Graffiti: {
    name: 'Graffiti',
    image: require('../../assets/images/spray.png'),
    screen: GraffitiScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
};

const Other = {
  Other: {
    name: 'Other',
    image: require('../../assets/images/contract.png'),
    screen: OtherScreen,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  }
};


// Issue button component
const IssueButton = (navigation, issueCat, issue, issueIndex, issueArr) => (
  <TouchableOpacity
    key={issueCat}
    onPress={() => {
      const { path, params, screen } = issue;
      const { router } = screen;
      const action = path && router.getActionForPathAndParams(path, params);
      navigation.navigate(issueCat, {}, action);
    }}
  >
    <SafeAreaView
      style={issueArr.length - 1 === issueIndex ? '' : styles.itemBorder}
      forceInset={{ vertical: 'never' }}
    >
      <Image style={styles.issueIcon} source={issue.image}/>
      <View style={styles.item}>
        <Text style={styles.title}>
          {issue.name}
        </Text>
        <Icon name="ios-arrow-forward" style={{paddingHorizontal: 3}} color="#BDBDBD" size={22}/>
      </View>
    </SafeAreaView>
  </TouchableOpacity>
);

const RequestScreen = ({ navigation }) => (
  <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentInsetAdjustmentBehavior="automatic">
      <View key="StreetsSidewalks">
        <Text style={styles.categoryTitle}>
          ANIMALS
        </Text>
        {Object.keys(Animals).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, Animals[issueCategory], i, arr)
        ))}
        <Text style={styles.categoryTitle}>
          STREETS & SIDEWALKS
        </Text>
        {Object.keys(StreetsSidewalks).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, StreetsSidewalks[issueCategory], i, arr)
        ))}
        <Text style={styles.categoryTitle}>
          PARKING & VEHICLES
        </Text>
        {Object.keys(ParkingVehicles).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, ParkingVehicles[issueCategory], i, arr)
        ))}
        <Text style={styles.categoryTitle}>
          TREES & PARKS
        </Text>
        {Object.keys(TreesPark).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, TreesPark[issueCategory], i, arr)
        ))}
        <Text style={styles.categoryTitle}>
          SANITATION
        </Text>
        {Object.keys(Sanitation).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, Sanitation[issueCategory], i, arr)
        ))}
        <Text style={styles.categoryTitle}>
          OTHER
        </Text>
        {Object.keys(Other).map((issueCategory: string, i, arr) => (
          IssueButton(navigation, issueCategory, Other[issueCategory], i, arr)
        ))}
      </View>
  </ScrollView>
);

const headerBack = (navigation) => (
  <TouchableOpacity style={{marginRight: 15}} onPress={() => navigation.goBack(null)}>
    <Icon name="ios-arrow-back" style={{paddingHorizontal: 15}} color="#f3f3f3" size={26}/>
  </TouchableOpacity>
);

const MainStack = StackNavigator(
  {
    ...Animals,
    ...StreetsSidewalks,
    ...ParkingVehicles,
    ...TreesPark,
    ...Sanitation,
    ...Other,
    Index: {
      screen: RequestScreen,
      navigationOptions: ({navigation}) => ({
        title: 'New Request',
        headerLeft: (headerBack(navigation)),
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      }),
    },
  },
  {
    initialRouteName: 'Index',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
  }
);

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingLeft: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#BDBDBD',
    borderBottomLeftRadius: 80
  },
  issueIcon: {
    height: 50,
    width: 50,
    margin: 10,
    position: 'absolute'
  },
  title: {
    fontSize: 20,
    flex: 1,
    color: '#444',
    alignSelf: 'flex-start'
  },
  description: {
    fontSize: 13,
    color: '#999',
  },
  header: {
    backgroundColor: '#4f4380'
  },
  headerTitle: {
    color: 'white'
  },
  categoryTitle: {
    marginTop: 10,
    padding: 10,
    fontSize: 18,
    color: '#eeac01',
    fontWeight: 'bold'
  }
});

export default MainStack;