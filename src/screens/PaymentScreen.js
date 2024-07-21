import { Alert, Button, NativeEventEmitter, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import PayUBizSdk from 'payu-non-seam-less-react';
import { sha512 } from 'js-sha512';

const PaymentScreen = () => {
    const [key,setKey]=useState("");
    const [merchantSalt, setMerchantSalt] = useState("");

    const [amount, setAmount] = useState('20');
    const [productInfo, setProductInfo] = useState('food  order');
    const [firstName, setFirstName] = useState('Anirban');

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [ios_surl, setIosSurl] = useState(
        'https://success-nine.vercel.app',
      );
      const [ios_furl, setIosFurl] = useState(
        'https://failure-kohl.vercel.app',
      );
      const [environment, setEnvironment] = useState(1 + '');
      const [android_surl, setAndroidSurl] = useState(
        'https://success-nine.vercel.app',
      );
      const [android_furl, setAndroidFurl] = useState(
        'https://failure-kohl.vercel.app',
      );

  const [udf1, setUdf1] = useState('udf1s');
  const [udf2, setUdf2] = useState('udf2');
  const [udf3, setUdf3] = useState('udf3');
  const [udf4, setUdf4] = useState('udf4');
  const [udf5, setUdf5] = useState('udf5');

  const [showCbToolbar, setShowCbToolbar] = useState(true);
  const [userCredential, setUserCredential] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4c31ae');

  const [secondaryColor, setSecondaryColor] = useState('#022daf');
  const [merchantName, setMerchantName] = useState('DEMO PAY U');
  const [merchantLogo, setMerchantLogo] = useState("" );

  const [cartDetails, setCartDetails] = useState([
    {Order: 'Food Order'},
    {'order Id': '123456'},
    {'Shop name': 'Food Shop'},
  ]);
  const [paymentModesOrder, setPaymentModesOrder] = useState([
    {UPI: 'TEZ'},
    {Wallets: 'PAYTM'},
    {EMI: ''},
    {Wallets: 'PHONEPE'},
  ]);
  const [surePayCount, setSurePayCount] = useState(1);
  const [merchantResponseTimeout, setMerchantResponseTimeout] = useState(10000);
  const [autoApprove, setAutoApprove] = useState(false);
  const [merchantSMSPermission, setMerchantSMSPermission] = useState(false);
  const [
    showExitConfirmationOnCheckoutScreen,
    setShowExitConfirmationOnCheckoutScreen,
  ] = useState(true);
  const [
    showExitConfirmationOnPaymentScreen,
    setShowExitConfirmationOnPaymentScreen,
  ] = useState(true);

  const [autoSelectOtp, setAutoSelectOtp] = useState(true);

  requestSMSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        {
          title: 'PayU SMS Permission',
          message:
            'Pay  U Demo App needs access to your sms to autofill OTP on Bank Pages ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('SMS Permission Granted!');
      } else {
        console.log('SMS Permission Denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  displayAlert = (title, value) => {
    Alert.alert(title, value);
    
  };
  onPaymentSuccess = e => {
    console.log(e.merchantResponse);
     console.log(e.payuResponse);
     displayAlert('onPaymentSuccess', "Payment success");
   };

   onPaymentFailure = e => {
    console.log(e.merchantResponse);
    console.log(e.payuResponse);
    displayAlert('onPaymentFailure', JSON.stringify(e));
  }


  onPaymentCancel = e => {
    console.log('onPaymentCancel isTxnInitiated -' + e);
    displayAlert('onPaymentCancel', JSON.stringify(e));
  }

  onError = e => {
 displayAlert('onError', JSON.stringify(e));
  };


  calculateHash = data => {
    console.log(data);
    var result = sha512(data);
    console.log(result);
    return result;
  };

  sendBackHash = (hashName, hashData) => {
    var hashValue = calculateHash(hashData);
    var result = {[hashName]: hashValue};
     console.log(result);
    PayUBizSdk.hashGenerated(result);
  };
  generateHash = e => {
    console.log(e.hashName);
    console.log(e.hashString);
    sendBackHash(e.hashName, e.hashString + merchantSalt);
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(PayUBizSdk);
    payUOnPaymentSuccess = eventEmitter.addListener(
      'onPaymentSuccess',
      onPaymentSuccess,
    );
    payUOnPaymentFailure = eventEmitter.addListener(
      'onPaymentFailure',
      onPaymentFailure,
    );
    payUOnPaymentCancel = eventEmitter.addListener(
      'onPaymentCancel',
      onPaymentCancel,
    );
    payUOnError = eventEmitter.addListener('onError', onError);
    payUGenerateHash = eventEmitter.addListener('generateHash', generateHash);

    //Unregister eventEmitters here
    return () => {
    console.log('Unsubscribed!!!!');
      payUOnPaymentSuccess.remove();
      payUOnPaymentFailure.remove();
      payUOnPaymentCancel.remove();
      payUOnError.remove();
      payUGenerateHash.remove();
    };
  }, [merchantSalt]);

  const createPaymentParams=()=>{
    var txnid = new Date().getTime().toString();
    var payUPaymentParams = {
        key: key,
        transactionId: txnid,
        amount: amount,
        productInfo: productInfo,
        firstName: firstName,
        email: email,
        phone: phone,
        ios_surl: ios_surl,
        ios_furl: ios_furl,
        android_surl: android_surl,
        android_furl: android_furl,
        environment: environment,
        userCredential: userCredential,
        additionalParam: {
          udf1: udf1,
          udf2: udf2,
          udf3: udf3,
          udf4: udf4,
          udf5: udf5,
          walletUrn: '100000',
        },
      };
      var payUCheckoutProConfig = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        merchantName: merchantName,
        merchantLogo: merchantLogo,
        showExitConfirmationOnCheckoutScreen:
          showExitConfirmationOnCheckoutScreen,
        showExitConfirmationOnPaymentScreen: showExitConfirmationOnPaymentScreen,
        cartDetails: cartDetails,
        paymentModesOrder: paymentModesOrder,
        surePayCount: surePayCount,
        merchantResponseTimeout: merchantResponseTimeout,
        autoSelectOtp: autoSelectOtp,
        autoApprove: autoApprove,
        merchantSMSPermission: merchantSMSPermission,
        showCbToolbar: showCbToolbar,
      };
      return {
        payUPaymentParams: payUPaymentParams,
        payUCheckoutProConfig: payUCheckoutProConfig,
      };

  }

  const lunchPayUPayment=()=>{
    PayUBizSdk.openCheckoutScreen(createPaymentParams());

}

  return (
    <View>
      <Text style={{fontSize:20,marginVertical:20}}>Your  payable Amount is {amount}</Text>
      <Button
      title='Pay Now'
      onPress={lunchPayUPayment}
      />
    </View>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({})