// (function() {

angular.module('reasoncodes', [])
	.factory('ReasonCodeList', function() {

		var visa_cb = [

	      { "Type":"Visa",
	      	"Code":"30",
	        "Text":"Services Not Provided or Merchandise Not Received",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"41",
	        "Text":"Cancelled Recurring Transaction",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"53",
	        "Text":"Not as Described or Defective Merchandise",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"57",
	        "Text":"Fraudulent Multiple Transactions",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"60",
	        "Text":"Requested Copy Illegible",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"62",
	        "Text":"Counterfeit Transaction",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"70",
	        "Text":"Account Number on Exception File",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"71",
	        "Text":"Declined Authorization",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"72",
	        "Text":"No Authorization Obtained",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"73",
	        "Text":"Expired Card",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"74",
	        "Text":"Late Presentment",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"75",
	        "Text":"Cardholder Does Not Recognize the Transaction",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"76",
	        "Text":"Incorrect Transaction Code",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"77",
	        "Text":"Non Matching Acct Number",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"78",
	        "Text":"Service Code Violation, did not Obtain Authorization",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"79",
	        "Text":"Requested Transaction Information Not Received",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"80",
	        "Text":"Incorrect Transaction Amount or Acct Number",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"81",
	        "Text":"Fraudulent Transaction - Card Present",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"82",
	        "Text":"Duplicate Processing",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"83",
	        "Text":"Fraudulent Transaction - Card Not Present",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"85",
	        "Text":"Credit Not Processed",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"86",
	        "Text":"Paid by Other Means",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"90",
	        "Text":"Services Not Rendered - ATM or VisaTravel Money Transactions",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"93",
	        "Text":"Risk Identification Service (RIS)",
	        "Stage":"CB"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"96",
	        "Text":"Transaction Exceeds Floor Limit",
	        "Stage":"CB"
	      }
			
		];

 		var visa_rr = [
		  {
		  	"Type":"Visa",
	        "Code":"28",
	        "Text":"Cardholder Requests Copy Bearing Signature ",
	        "Stage":"RR"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"29",
	        "Text":"Request for T&E Documents",
	        "Stage":"RR"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"30",
	        "Text":"Cardholder Dispute - Cardholder Requests Draft",
	        "Stage":"RR"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"33",
	        "Text":"Legal Process or Fraud Analysis",
	        "Stage":"RR"
	      },
	      {
	      	"Type":"Visa",
	        "Code":"34",
	        "Text":"Repeat Request for Copy",
	        "Stage":"RR"
	      }

		];

    var master_cb = [

      {
      	"Type":"Mastercard",
        "Code":"4801",
        "Text":"Requested Transaction Information not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4802",
        "Text":"Requested/Required Information Illegible or Missing",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4803",
        "Text":"Documentation Received Invalid/Incomplete",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4804",
        "Text":"Duplicate Processing",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4807",
        "Text":"Warning Bulletin Filed",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4808",
        "Text":"Requested/Required Authorization Not Obtained",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4812",
        "Text":"Account Number Not on File",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4831",
        "Text":"Transaction Amount Differs (Authorization to Settlement)",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4834",
        "Text":"Duplicate Processing",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4835",
        "Text":"Card Not Valid or Expired",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4837",
        "Text":"No Cardholder Authorization",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4840",
        "Text":"Fraudulent Processing of Transaction",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4841",
        "Text":"Cancelled Recurring Transaction",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4842",
        "Text":"Late Presentment",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4846",
        "Text":"Correct Transaction Currency Code Not Provided",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4847",
        "Text":"Exceeds Floor Limit - Not Authorized and Fraudulent Transaction",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4849",
        "Text":"Questionable Merchant Activity",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4850",
        "Text":"Credit Posted as a Purchase",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4853",
        "Text":"Merchandise/Services Not as Described",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4854",
        "Text":"Cardholder Dispute Not Elsewhere Classified (US Only)",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4855",
        "Text":"Non-receipt of Merchandise",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4856",
        "Text":"Defective Merchandise",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4857",
        "Text":"Card Activated Telephone Transaction",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4859",
        "Text":"Services Not Rendered",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4860",
        "Text":"Credit Not Processed",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4862",
        "Text":"Counterfeit Transaction Magnetic Stripe POS Fraud",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4863",
        "Text":"Cardholder Does Not Recognize - Potential Fraud (US Only)",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4870",
        "Text":"Chip Liability Shift",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4871",
        "Text":"Chip & PIN Liability Shift",
        "Stage":"CB"
      },
      {
      	"Type":"Mastercard",
        "Code":"4905",
        "Text":"Invalid Acquirer Reference Data on Second Presentment",
        "Stage":"CB"
      }

     ];
     
     var master_rr = [ 
      
      {
      	"Type":"Mastercard",
        "Code":"43",
        "Text":"Legal/Fraud Imprint Verification",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"42",
        "Text":"Potential Chargeback or Compliance Documentation",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"41",
        "Text":"Legal/Fraud Signature Verification",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"24",
        "Text":"Cardholder Inquiry - Unspecified/Other",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"23",
        "Text":"Cardholder Inquiry - Needs for Personal Records",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"22",
        "Text":"Cardholder Inquiry - Disagrees with Billing",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"21",
        "Text":"Cardholder Inquiry - Does Not Recognize Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Mastercard",
        "Code":"5",
        "Text":"Cardholder Does Not Agree with Amount Billed",
        "Stage":"RR"
      }
  ];

  var disc_cb = [
      {
      	"Type":"Discover",
        "Code":"AL",
        "Text":"Cardholder challenges the validity of an airline Card Sale",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"AP",
        "Text":"Automatic Payment Dispute",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"AW",
        "Text":"Altered Amount Dispute",
        "Stage":"CB"
      },
      {
        "Code":"CA",
        "Text":"Cash Advance Dispute other than Discover Network ATM Transaction",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"CD",
        "Text":"Credit Posted as Card Sale",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"CR",
        "Text":"Cancelled Reservation",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"DA",
        "Text":"Merchant Received Declined Authorization Response",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"DP",
        "Text":"Duplicate Processing                ",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"EX",
        "Text":"Expired Card",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"IC",
        "Text":"Illegible or Missing Transaction Documentation",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"IN",
        "Text":"Invalid Card Number",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"IS",
        "Text":"Documentation in response to Retrieval Request Missing Valid/Legible Signature",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"LP",
        "Text":"Late Presentment",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"NA",
        "Text":"Merchant Did Not Obtain Positive Authorization Response",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"NC",
        "Text":"Not Classified - Cardholder challenges sale and no other Reason Code applies",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"RG",
        "Text":"Non-receipts of Goods or Services",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"RM",
        "Text":"Quality of Goods or Services Dispute",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"RN1",
        "Text":"Additional Credit Requested",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"RN2",
        "Text":"Credit Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"SV",
        "Text":"Prepaid/Gift card Transaction Dispute",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"TF",
        "Text":"Violation of Operating Regulations",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA01",
        "Text":"No Authorization Request from Merchant",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA02",
        "Text":"Issuer Provided Declined Authorization",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA03",
        "Text":"Amount Billed Exceeds amount Authorized by Issuer",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA11",
        "Text":"Swiped Card Transaction - No Signature Obtained",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA12",
        "Text":"Swiped Card Transaction - Invalid Signature",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA18",
        "Text":"Swiped Card Transaction - Illegible Copy of Receipt",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA21",
        "Text":"Keyed Card Transaction - No Signature Obtained",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA22",
        "Text":"Keyed Card Transaction - Invalid Signature",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA23",
        "Text":"Keyed Card Transaction - Invalid Card Imprint",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA28",
        "Text":"Keyed Card Transaction - Illegible Copy of Transaction Documentation",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA31",
        "Text":"CNP Transaction - Invalid Proof of Delivery",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA32",
        "Text":"CNP Transaction - Merchant did not perform AVS or CID check",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA38",
        "Text":"CNP Transaction - Illegible Copy of Transaction Documentation",
        "Stage":"CB"
      },
      {
      	"Type":"Discover",
        "Code":"UA99",
        "Text":"Non-Compliance with Operating Regulations",
        "Stage":"CB"
      }
   ];
   
   var disc_rr = [  
      {
      	"Type":"Discover",
        "Code":"UA10",
        "Text":"Request Receipt from Card Present Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"UA20",
        "Text":"Request Documentation from Keyed Card Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"UA30",
        "Text":"Request Documentation for Card Not Present Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"TNM",
        "Text":"Cash Advance Dispute - Does Not Recognize Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"P",
        "Text":"Cash Advance Dispute - Does Not Recognize Location Withdraw occurred",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"N",
        "Text":"Cash Advance Dispute - Present at ATM but Funds not Received",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"DP1",
        "Text":"Cash Advance Dispute - Duplicate Processing",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"AL",
        "Text":"Cardholder challenges the validity of an airline Card Sale",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"AP",
        "Text":"Automatic Payment Dispute",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"AW",
        "Text":"Altered Amount Dispute",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"CA",
        "Text":"Cash Advance Dispute other than Discover Network ATM Transaction",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"CD",
        "Text":"Credit Posted as Card Sale",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"CR",
        "Text":"Cancelled Reservation",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"DP",
        "Text":"Duplicate Processing",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"NC",
        "Text":"Not Classified - Cardholder challenges",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"RG",
        "Text":"Non-receipts of Goods or Services",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"RM",
        "Text":"Quality of Goods or Services Dispute",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"RN1",
        "Text":"Additional Credit Requested ",
        "Stage":"RR"
      },
      {
      	"Type":"Discover",
        "Code":"RN2",
        "Text":"Credit Not Received",
        "Stage":"RR"
      }
   ];  

  var amex_cb = [

      {
      	"Type":"Amex",
        "Code":"A01",
        "Text":"Amount Differs from Authorization to Settlement",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A02",
        "Text":"Did Not Receive Valid Authorization Approval",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A03",
        "Text":"Valid 6 digit Authorization code Not Provided",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A04",
        "Text":"Valid Authorization Not Obtained - You were advised to call AmEx directly",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A05",
        "Text":"Authorization Approval Code Not on Record",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A06",
        "Text":"Overlimit Authorization Approval Not Obtained",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A07",
        "Text":"Authorization Was Declined",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A08",
        "Text":"Charge submitted After Authorization Expired (Valid 30 days)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A09",
        "Text":"Charge submitted After Authorization Expired (Valid 30 days)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"A10",
        "Text":"Transaction did not Receive Valid Approval",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C01",
        "Text":"Credit Agreed to Provide Cardholder Not Received ",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C02",
        "Text":"Credit Agreed to Provide Cardholder Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C03",
        "Text":"Credit Agreed to Provide Cardholder Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C04",
        "Text":"Cardholder Provided Proof Merchandise Returned",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C05",
        "Text":"Cardholder Provided Proof Order Cancelled",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C06",
        "Text":"Credit Not Processed",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C07",
        "Text":"Disputes Return Policy",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C08",
        "Text":"Merchandise Not Received",
        "Stage":"CB"
      },
      { "Type":"Amex",
        "Code":"C09",
        "Text":"Services Not Rendered",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C10",
        "Text":"Discontinue Recurring Billing - Second Contact/Notice",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C11",
        "Text":"Cardholder Claims Charge Greater than what they Signed for",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C12",
        "Text":"Cardholder Claims Charge Greater than what they Signed for",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C13",
        "Text":"Cardholder  Paid by Other Means",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C14",
        "Text":"Cardholder Provided Proof Paid by Other Means",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C15",
        "Text":"Cardholder Provided Proof Paid by Other Means",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C16",
        "Text":"International Card - Can't Charge for this good/service",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C17",
        "Text":"AmEx Card Not Valid In US",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C18",
        "Text":"Reservation Cancelled - Credit Due",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C19",
        "Text":"Double Billing - Charged for No Show and Reservation",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C25",
        "Text":"Cardholder received Merchandise (Positive Signal)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C26",
        "Text":"Discontinue all Future Billings to this Account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C27",
        "Text":"Cardholder No Longer Disputes Charges (Positive Signal)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C28",
        "Text":"Charge Submitted After You Were Advised to Discontinue Future Billing",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"C29",
        "Text":"Supporting Documentation Provided by Merchant shows Overcharge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F01",
        "Text":"Did Not Receive Valid Authorization Approval for Amount of Charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F05",
        "Text":"No Signature",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F06",
        "Text":"Client information does not match Cardholder info",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F08",
        "Text":"Unable to Support Signature on File charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F10",
        "Text":"Did not receive Full Mag Stripe Data",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F11",
        "Text":"Signature is not that of Cardholders",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F12",
        "Text":"Signature Misspelled",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F13",
        "Text":"Signature differs from name on card",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F14",
        "Text":"Cardholder Signature was Not Obtained",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F15",
        "Text":"Self Directed Charged and Signed Documentation not Available",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F16",
        "Text":"Customer didn't Place Order",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F17",
        "Text":"Tickets Sent to address other than Cardholder address and Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F18",
        "Text":"Merchandise not shipped Cardholder billing address and Cardholder disputes billing",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F19",
        "Text":"Cardholder Claims Merchandise Not Received and was not sent to Billing Address",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F20",
        "Text":"Expired Card",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F21",
        "Text":"Card Not Valid",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F22",
        "Text":"Card Expired or Not Yet Valid",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F23",
        "Text":"Card Expired when Ticket was Accepted",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F24",
        "Text":"Multiple Charges",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F25",
        "Text":"Did Not Receive Authorization Approval for Total Amount Charged",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F26",
        "Text":"Name Provided on Transaction is Not Cardholder Name",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F27",
        "Text":"Supporting Documentation Does Not Bear Cardholders Name",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"F28",
        "Text":"Cardholder Claims Fraudulent Use of Cards for Mail or Electronic Tickets Order",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR1",
        "Text":"Establishment on Full Recourse/Immediate Chargeback Program",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR2",
        "Text":"Establishment on Full Recourse/Immediate Chargeback Program",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR3",
        "Text":"Cardholder has No Knowledge of Charge after Supporting Documents Provided",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR4",
        "Text":"Establishment on Immediate Chargeback Agreement",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR5",
        "Text":"Establishment on Immediate Chargeback Program",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR6",
        "Text":"Establishment on Partial Immediate Chargeback Agreement",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"FR40",
        "Text":"Establishment on Immediate Chargeback Agreement",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M01",
        "Text":"Chargeback Authorization Received and Processed",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M02",
        "Text":"Processed Credit Establishment Requested",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M05",
        "Text":"Credit Authorized but Cardholder Does Not Agree to Amount",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M07",
        "Text":"Cannot Bill Cardholder from (Hotel) Room Damages",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M08",
        "Text":"Cannot Bill Cardholder from Damages",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M09",
        "Text":"Your Contract with AmEx does Not permit billing for Damages",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M15",
        "Text":"Account No Longer Active",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M16",
        "Text":"Charge Incurred after Account was Cancelled",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M17",
        "Text":"Cardholders Account Cancelled at time Charge was Incurred",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M18",
        "Text":"Second notice of Inactive Account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M30",
        "Text":"Submitted file not processed because it appears to be Duplicate",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M32",
        "Text":"Processed Adjustment to your Account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M34",
        "Text":"Establishment Not on CARDeposit Program and you may Not Bill this type of charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M35",
        "Text":"Unspecified or Other Adjustment (Explanation Included)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M36",
        "Text":"Unspecified or Other Adjustment",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M37",
        "Text":"Credit must be processed to Cardholders AmEx account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M41",
        "Text":"Support has been provided to Cardholder who still denies charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M47",
        "Text":"Cardholder had no Knowledge of charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"M48",
        "Text":"Chargeback Reversed (Positive Signal)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P01",
        "Text":"Transaction submitted for invalid/incorrect Account number",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P02",
        "Text":"Transaction submitted for invalid/incorrect Account number",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P05",
        "Text":"Transaction Processed in Wrong Amount",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P06",
        "Text":"Charge Submitted Late",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P07",
        "Text":"Charge Not Submitted in Reasonable Time after Charge was incurred",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P08",
        "Text":"Cardholder Claims Same Transaction Posted Twice on Account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P10",
        "Text":"AmEx Records Indicate Duplicate Billing",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P11",
        "Text":"Cardholder Claimed Duplicate Billing and you did Not Provide Support for all Charges",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P14",
        "Text":"Invalid Charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P15",
        "Text":"Complete Response/Documentation Not Received with Specified Time Frame ",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P16",
        "Text":"Original Response to Inquiry not Received with Specified Time Frame",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P17",
        "Text":"Missed Deadline to Supply Documentation for Representment",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P18",
        "Text":"Response Received but Not Agreed Credits",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P19",
        "Text":"Charge Submitted on Invalid Plastic Number",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P20",
        "Text":"Credit Submitted on Invalid Plastic Number",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"P21",
        "Text":"Transaction was Submitted on a Test Account Number",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R01",
        "Text":"Full Shipping Information Not Provided on Proof of Delivery",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R02",
        "Text":"Delivery Address not Provided as Requested",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R03",
        "Text":"Insufficient Documentation - Itemized Receipt",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R04",
        "Text":"Reply Did Not Address Cardholder Dispute",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R05",
        "Text":"Cannot Bill Cardholder Account for Check that has been Returned",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R06",
        "Text":"Cust didn't Place Order & Goods Never Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R07",
        "Text":"Delivery Address and Signed Proof of Delivery Not Provided",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R10",
        "Text":"Supporting Documentation Provided Did Not Include Name and/or Signature",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R13",
        "Text":"Second Inquiry to Request Information Regarding Charge",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R14",
        "Text":"Response to Inquiry Not Received within time frame",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R15",
        "Text":"Documentation/Support Agreed to Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R17",
        "Text":"Documentation/Support Received After Debit has been Made",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R20",
        "Text":"Did Not Receive Reply",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R21",
        "Text":"Reply Received After AmEx charged your Account",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R22",
        "Text":"Support Received and Chargeback Reversed (Positive Signal)",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"R23",
        "Text":"Terms and Conditions and/or Proof of Usage by Cardholder Not Provided",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"S01",
        "Text":"Request for Chargeback Reversal Reviewed and Denied - Account Not Credited",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"T01",
        "Text":"Issuer Provides Proof Tickets were Returned and Cardholder did not Receive Credit",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"T02",
        "Text":"Tickets were voided and Cardholder Credit Not Received",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"T03",
        "Text":"Tickets are mirror images tickets",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"T04",
        "Text":"Lost Ticket Review Period Elapsed",
        "Stage":"CB"
      },
      {
      	"Type":"Amex",
        "Code":"T05",
        "Text":"Charges not Authorized",
        "Stage":"CB"
      }
    ];
    
    var amex_rr = [  
      {
      	"Type":"Amex",
        "Code":"3",
        "Text":"Credit Not Received for Tickets/Vouchers",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"4",
        "Text":"Request Reshipment of Tickets Not Received",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"7",
        "Text":"Billing was to be in Installments - Credit Due",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"9",
        "Text":"Customer Requests Return Instructions/Pickup",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"10",
        "Text":"Partial Credit Received - Remaining Credit Due",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"11",
        "Text":"Customers Requests Waiving Cancellation Fee - Credit Due",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"12",
        "Text":"Charged Billed Twice in Error",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"15",
        "Text":"Requests Credit for Exchange Fee",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"16",
        "Text":"Requests Credit for Damaged Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"18",
        "Text":"Requests Credit for Overcharge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"20",
        "Text":"Claims Cancelled Service - Requests Credit and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"21",
        "Text":"Claims Cancelled Service - Issue Credit or Provide Cancellation Policy and Discontinue Billing",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"22",
        "Text":"Claims Cancelled Membership - Requests Credit and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"24",
        "Text":"Damaged Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"27",
        "Text":"Order Canceled - Issue Credit or Provide Cancellation Policy/Proof of Delivery",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"28",
        "Text":"Membership Cancelled in Writing - Issue Credit/supply signed Cancellation Policy & discontinue",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"29",
        "Text":"Membe Expired - Issue Credit or supply signed contract with renewal policy/expiration date",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"30",
        "Text":"Defective Merchandise - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"31",
        "Text":"Deposit on Vehicle not Purchased",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"33",
        "Text":"Cardholder Does has No Knowledge of Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"40",
        "Text":"Service / Membership Cancelled - Credit Requested or Proof of Usage",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"41",
        "Text":"Unable to contact/cancel - Discontinue Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"42",
        "Text":"Customer Claims Alternate Bill Arrangement - Requests Credit and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"43",
        "Text":"Request to Cancel Service - Contact Customer Directly",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"44",
        "Text":"Requests Cancellation of Service - Provide Cancellation instructions/authorization",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"45",
        "Text":"Requests Replacement for Damaged Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"48",
        "Text":"Requests Replacement for Damaged Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"49",
        "Text":"Deposit on Vehicle not Leased - Issue Credit or Provide signed Agreement",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"59",
        "Text":"Requests Repair of Damaged Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"60",
        "Text":"Requests Repair of Defective Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"61",
        "Text":"Credit should have been Charge - Bill Customer",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"62",
        "Text":"Charge should have been Credit - Issue Full Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"63",
        "Text":"Dissatisfied w/ Good/Service - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"70",
        "Text":"Dissatisfied w/ Repair Work on Vehicle - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"71",
        "Text":"Requests Credit for Personal Property Damage (Moving services) - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"72",
        "Text":"Cardholder has no Knowledge of Billing and it has Wrong Signature",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"73",
        "Text":"Reservation not Guaranteed",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"76",
        "Text":"Cancelled Service - Issue credit or provide copy of agreement and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"77",
        "Text":"Request to Return Merchandise - Provide Return Instructions",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"78",
        "Text":"Invalid Plastic Number",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"79",
        "Text":"Invalid Plastic Number",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"80",
        "Text":"Cancelled Time Share - Credit Requested or provide copy of signed agreement",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"82",
        "Text":"Customer has No Knowledge of Credit to their Account",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"83",
        "Text":"Referenced Customer Deceased",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"86",
        "Text":"Discontinue billings to this Inactive Account",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"87",
        "Text":"Issue Credit and Discontinue Billing to Inactive Acct",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"89",
        "Text":"Alternative Billing Arrangements - Credit Requested or provide supporting documentation",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"90",
        "Text":"Membership/Service Paid in Full - Credit Requested and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"91",
        "Text":"Cancellation Made within Allowable Time - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"93",
        "Text":"Cardholder Does Not Recognize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"94",
        "Text":"Cardholder Does Not Recognize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"95",
        "Text":"Cancelled Service - Credit Requested or provide signed proof serviced were rendered",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"97",
        "Text":"Customer Requests Credit for Unauthorized Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"99",
        "Text":"Class/Course Cancelled - Credit Requested",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"107",
        "Text":"Facility No Longer Open - Credit Requested and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"110",
        "Text":"Calls associated with charges Connected to Wrong Number",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"117",
        "Text":"Call associated with charges was Cut-off",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"119",
        "Text":"Cardholder has No Knowledge of CARDeposit Billing - Requests Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"120",
        "Text":"Requests Credit for Overcharge for Vehicle Rental ",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"121",
        "Text":"Requests Credit for Rental Vehicle did not perform properly",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"122",
        "Text":"Cardholder has No Knowledge of Vehicle Rental - Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"123",
        "Text":"Cardholder has No Knowledge of Vehicle Rental - Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"124",
        "Text":"Customer Requests support for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"125",
        "Text":"Cardholder has No Knowledge of Vehicle Rental - Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"127",
        "Text":"Cardholder Does Not Recognize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"128",
        "Text":"Cardholder Claims they did Not Authorize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"129",
        "Text":"Cardholder Does Not Recognize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"130",
        "Text":"Requests Credit for Deposit not Deducted from Rental Billing",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"131",
        "Text":"Charge was to be Billed Directly to Insurance company",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"132",
        "Text":"Customer Billed Twice from separate business addresses",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"133",
        "Text":"Billed Twice for same Purchase",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"134",
        "Text":"Customer Claims Portion of Charge was a Deposit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"136",
        "Text":"Customer Claims Charge was for Deposit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"141",
        "Text":"Customer Claims Charge was Deposit on Vehicle Returned",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"143",
        "Text":"Customer Claims Flowers ordered Not Received",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"146",
        "Text":"Disputed Merchandise Returned but 2nd charge processed instead of credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"147",
        "Text":"Customer Claims Billing Paid by Insurance Company",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"150",
        "Text":"Returned Damaged Merchandise - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"151",
        "Text":"Returned Damaged Merchandise and Requests Replacement or Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"152",
        "Text":"Received & Returned Incorrect Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"153",
        "Text":"Received & Returned Incorrect Merchandise and Requests Replacement or Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"154",
        "Text":"Cancelled Order - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"155",
        "Text":"Merchandise not Received - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"156",
        "Text":"Merchandise not Received - Issue Credit and Rebill Upon Delivery",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"157",
        "Text":"Returned Merchandise but not sent Replacement- Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"158",
        "Text":"Merchandise Returned",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"159",
        "Text":"Customer Requests signed support and itemization for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"160",
        "Text":"Tickets/Vouchers not Ordered - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"161",
        "Text":"Tickets/Vouchers Returned - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"162",
        "Text":"Tickets/Vouchers Returned - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"163",
        "Text":"Tickets/Vouchers Not Received - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"164",
        "Text":"Tickets/Vouchers unused and Lost or Stolen - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"165",
        "Text":"Tickets/Vouchers Lost or Stolen - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"166",
        "Text":"Requests Credit for Payment made directly to establishment",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"167",
        "Text":"Reservation Confirmed on Incorrect Date - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"168",
        "Text":"Reservation Confirmed in Incorrect Location - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"169",
        "Text":"Incorrect Conversion Rate Used - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"170",
        "Text":"Cancelled Reservation - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"171",
        "Text":"Assured Reservation Not Honored - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"173",
        "Text":"Requests Credit for Duplicate Billing",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"174",
        "Text":"Customer Requests signed support and itemization for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"175",
        "Text":"Customer Requests Credit for a Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"176",
        "Text":"Cardholder Does Not Recognize the referenced Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"177",
        "Text":"Cardholder Claims Charge Unauthorized",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"178",
        "Text":"No Merchandise Ordered or Delivered - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"179",
        "Text":"Cardholder Does Not Recognize Charge for Reservation",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"180",
        "Text":"Cardholder Does Not Recognize Charge for stay at Establishment.",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"181",
        "Text":"No Knowledge of Referenced No Show Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"182",
        "Text":"Cardholder Question Charges for Damages at Establishment",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"183",
        "Text":"Cardholder Does Not Recognize Charges from Establishment",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"184",
        "Text":"Charges identified as Cash Advances - cannot be billed through AmEx",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"185",
        "Text":"Purchased but refused Delivery - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"186",
        "Text":"Incorrect Merchandise - Issue Credit and provider Return Instructions",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"187",
        "Text":"Requests Replacement for Incorrect Merchandise",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"188",
        "Text":"Cardholder has no Knowledge of Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"189",
        "Text":"No Subscription Issues Received - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"190",
        "Text":"No Subscription Issues Received - Request to begin Delivery",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"191",
        "Text":"Merchandise not Ordered or Received - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"192",
        "Text":"Customer Requests signed support and itemization for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"193",
        "Text":"Charges Incurred at establishment are Fraudulent",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"194",
        "Text":"Charges Incurred at establishment are Fraudulent - Full Magnetic Stripe data not received",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"195",
        "Text":"Customer Doesn't Recognize charge and Requests signed support and itemization for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"196",
        "Text":"Cardholder Does Not Recognize Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"197",
        "Text":"Subscription Cancelled yet Billed - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"198",
        "Text":"Subscription Never Ordered - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"199",
        "Text":"Cardholder charged for both stay and no-show - Requests Credit for No-show",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"200",
        "Text":"Sent Claim Report and Request signed support and itemization for Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"608",
        "Text":"Customer not disputing but requests signed support and itemization of charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"610",
        "Text":"Charge was to be to Third Party - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"620",
        "Text":"Customer was under billed",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"656",
        "Text":"No Knowledge of Referenced No-Show/Assured Reservation Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"657",
        "Text":"Requests Credit for Overcharge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"658",
        "Text":"Claims Received  Multiple Billings in Error",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"671",
        "Text":"Billing was to be Complimentary Stay",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"672",
        "Text":"Customer Doesn't Recognize delayed charges - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"673",
        "Text":"Billed Assured Reservation and Actual Stay - Credit Due for Assured Reservation",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"674",
        "Text":"Invalid or Incorrect Acct Number - Customer Doesn't Recognize Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"675",
        "Text":"CARDeposit Billing was to be Applied to the Stay - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"676",
        "Text":"Cancelled CARDeposit Reservation - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"678",
        "Text":"Second Request for Credit on Billing",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"679",
        "Text":"Billed Twice for CARDeposit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"680",
        "Text":"Customer Claims Overcharge - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"681",
        "Text":"Guaranteed Reservation Cancelled within Guidelines - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"682",
        "Text":"Cancellation of Membership - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"683",
        "Text":"Charge Belongs to another Person due to AmEx cards being switched",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"684",
        "Text":"Charge was Paid in Cash - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"685",
        "Text":"Customer Requests Copy of Signed Receipt",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"687",
        "Text":"Does Not Recognize Charge",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"688",
        "Text":"Charge was to be Paid by Customers Company - Credit and Rebill Correct Party",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"689",
        "Text":"Reservation Made and paid by Third Party - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"690",
        "Text":"Not Disputing Charges but requesting support and itemization",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"691",
        "Text":"Not Disputing Charges but requesting signed support and itemization",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"692",
        "Text":"Customer should have been billed for only one night - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"693",
        "Text":"Customer Questions charge for Damages - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"694",
        "Text":"Dissatisfactory Accommodations",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"695",
        "Text":"Payment made directly to Establishment - Provide Documentation or Issue Credit ",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"696",
        "Text":"Car Rental Cancelled - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"697",
        "Text":"Claims Billed Twice for same Rental Vehicle - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"698",
        "Text":"Customer Requests support for Rental Charges",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"699",
        "Text":"Customer should have been billed for only one night - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"700",
        "Text":"Service Cancelled - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"701",
        "Text":"Customer Requests Cancellation of Service- Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"702",
        "Text":"Customer Received Duplicate Credits",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"703",
        "Text":"Repair/Replacement was to be covered under warranty - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"704",
        "Text":"Event Cancelled - Credit due for Tickets not used",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"705",
        "Text":"Tickets Cancelled - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"706",
        "Text":"Customer Refused Delivery - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"707",
        "Text":"Call Associated with Bill had poor transmission quality",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"708",
        "Text":"Call Associated with Bill was not completed/connected",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"712",
        "Text":"Services Not Rendered",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"713",
        "Text":"Duplicate Billing - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"722",
        "Text":"Customer Does Not Recognize Charge for Stay - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"723",
        "Text":"Payment made directly to Establishment - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"730",
        "Text":"Issue Credit for Charge and Discontinue all Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"792",
        "Text":"Customer has no Knowledge of charge - Credit and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"800",
        "Text":"Customer No Longer Disputes Charge (Positive Signal)",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"R040",
        "Text":"Service/Membership Cancelled - Issue Credit and Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"R041",
        "Text":"Customer Unable to contact and Cancel Service - Discontinue Future Billings",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"R042",
        "Text":"Customer made Alternate Billing Arrangements - Provide Documentation or Issue Credit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"R043",
        "Text":"Customer Requests Cancellation of Service - Contact Customer Directly",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"R044",
        "Text":"Customer Requests Cancellation Instructions/Authorization- Contact Directly",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"RM05",
        "Text":"Cardholder does not agree to amount billed",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"RM21",
        "Text":"Cardholder does not recognize",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"RM23",
        "Text":"Cardholder Requests Copy",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"RM41",
        "Text":"Require for Legal/Fraud Analysis",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"RM42",
        "Text":"Required for chargeback",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"S06",
        "Text":"Automatic Closure of Inquiry",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V28",
        "Text":"Cardholder Requests Copy w/ Signature",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V29",
        "Text":"Charge detail or rental agreement request",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V30",
        "Text":"Cardholder requests copy",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V31",
        "Text":"Required for chargeback",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V32",
        "Text":"Original lost in transit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V33",
        "Text":"Required for legal/fraud analysis",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V34",
        "Text":"Repeat request for copy",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V35",
        "Text":"Written cardholder demand",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V36",
        "Text":"Legal process specifies original",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V37",
        "Text":"Previous copy illegible",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V38",
        "Text":"Required for paper/handwriting analysis",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V39",
        "Text":"Repeat request for original",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V40",
        "Text":"Required for arbitration",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V78",
        "Text":"Cardholder requests copy with signature",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V79",
        "Text":"Charge detail or rental agreement request",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V80",
        "Text":"Cardholder requests copy",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V81",
        "Text":"Required for chargeback",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V82",
        "Text":"Original lost in transit",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V83",
        "Text":"Required for legal/fraud analysis",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V84",
        "Text":"Repeat request for copy",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V85",
        "Text":"Written cardholder demand",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V86",
        "Text":"Legal process specifies original",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V87",
        "Text":"Previous copy illegible",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V88",
        "Text":"Required for paper/handwriting analysis",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V89",
        "Text":"Repeat request for original",
        "Stage":"RR"
      },
      {
      	"Type":"Amex",
        "Code":"V90",
        "Text":"Required for arbitration",
        "Stage":"RR"
      }
  ];		

	return {

			getText: function(code){ 
       
        var all = visa_cb.concat(visa_rr, master_cb, master_rr, disc_cb, disc_rr, amex_cb, amex_rr);
      
        for (var i =0; i < all.length; i++){
          if(all[i].Code === code){
            return all[i].Text;
          }
        }
        if (code) {
          return "Other";
        }

      },  
          
			getCodes: function(card, stage) {
        /*jshint maxcomplexity:15 */

				if(card === undefined || stage === undefined){
					return;
				}

				if (card === "VISA" && stage === "Chargeback"){
					return visa_cb;
				} 

				if (card === "VISA" && stage === "Retrieval-Request"){
				 	return visa_rr;	
				}

				if(card === "MASTERCARD" && stage === 'Chargeback'){
					return master_cb;
				}

				if(card === "MASTERCARD" && stage === 'Retrieval-Request'){
					return master_rr;
				}

				if(card === "DISCOVER" && stage === 'Chargeback'){
					return disc_cb;
				}
				if(card === "DISCOVER" && stage === 'Retrieval-Request'){
					return disc_rr;
				}	

				if(card === "AMEX" && stage === 'Chargeback'){
					return amex_cb;
				}

				if(card === "AMEX" && stage === 'Retrieval-Request'){
					return amex_rr;
				}
		}
	};	
});
