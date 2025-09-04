import { isValidName } from '../utilities/form/isValidName.js';
import { isValidSafePlace } from '../utilities/form/isValidSafePlace.js';
import { isValidDeliveryInstructions } from '../utilities/form/isValidDeliveryInstructions.js';
import { validateNumeric } from '../utilities/form/validateNumeric.js';
import { isValidPhone } from '../utilities/form/isValidPhone.js';

const safePlaceSelectElem = document.getElementById('safePlaceSelect') as HTMLSelectElement;
const otherSafePlaceElem = document.getElementById('other') as HTMLInputElement;
const activeClass = 'is_active' as string;

export function checkSafePlaceVal(safePlaceSelectElem: HTMLSelectElement, otherSafePlaceElem: HTMLInputElement, activeClass: string): void {
    if (safePlaceSelectElem.value  === "Z:Other") {
        if (!safePlaceSelectElem.checkVisibility()) {
            otherSafePlaceElem.classList.add(activeClass);
        }
    } else {
        if (safePlaceSelectElem.checkVisibility()) {
            otherSafePlaceElem.classList.remove(activeClass)
        }
    }
}

/*
function CheckMultiDeviceRemoves() {
	var strAASize = strAAMasterID = strProdId = "", floatPrice = 0.00, intQty = 0;
	var objItemArray = [];
	var objAAbag = {};
	$(".multiDeviceRemoveContainer").each(function() {
		var $this = $(this);
		var $removeCheckbox = $this.find("input");
		if ($removeCheckbox.attr("checked")) {
			var itemType = ($removeCheckbox.attr("data-itemtype"));
			if (itemType != 'W'){
				strProdId = ($removeCheckbox.attr("data-itemCode"));
				strProdId = getItemCodeSuffix(strProdId).item;
				if (strProdId == "89W749"){strAAMasterID = "testitem";} else {strAAMasterID = "unknown";}
				intQty = ($removeCheckbox.attr("data-qty"));
				floatPrice = "na";
				var objAAitem = {};
				if (checkConsentAdobe()){
					objAAitem.strAAMasterID = strAAMasterID; //need
					objAAitem.strAAProdID = strProdId.toLowerCase();
					objAAitem.strAAProdSKU = ""; //need
					objAAitem.strAAQty = intQty;
					objAAitem.strAASharedInd = "true";
					objAAitem.strAARemovalType = "shared device lightbox";
					objAAitem.strAASize = strAASize;  //need
					objAAitem.strAAUnitPrice = floatPrice; //need

					objItemArray.push(objAAitem);
				}
			}
		}
	});

	if (checkConsentAdobe()){
		objAAbag.items = objItemArray;
		if (objAAbag.items.length > 0) {
			objAAbag.strAAEventName = "remove from cart";
			objAAbag.strAAEventAction = "cart_remove";
			AACustomBagEvent(objAAbag);
		}
	}
}

export function disableParcelshopNoMapScrolling() {
	if ($(document).height() > $(window).height()) {
		var scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop();
		$("html").addClass("parcelShop-stopScrollWithScrollBar").css('top',-scrollTop);
	}
	else {
		$("html").addClass("parcelShop-stopScroll");
	}
}

export function enableParcelshopNoMapScrolling() {
	if ($(document).height() > $(window).height()) {
		var scrollTop = parseInt($('html').css('top'));
		$("html").removeClass("parcelShop-stopScrollWithScrollBar");
		$('html,body').scrollTop(-scrollTop);
	}
	else {
		$("html").removeClass("parcelShop-stopScroll");
	}
}

function validateManualDeliveryAddressPAF() {
    var errorCount = 0;

    // Check whether fields are all valid.
    if (!(validateFirstName($('#firstNameManual').attr('id'), $('#firstNameManual').val())))
    { errorCount += 1; }
    if (!(validateLastName($('#lastNameManual').attr('id'), $('#lastNameManual').val())))
    { errorCount += 1; }
    if (!(validateAddressLine1()))
    { errorCount += 1; }
    if (!(validateAddressLine2()))
    { errorCount += 1; }
    if (!(validateAddressLine3()))
    { errorCount += 1; }
    if (!(validateAddressLine4()))
    { errorCount += 1; }
    if (!(validateCity()))
    { errorCount += 1; }
    if (!(validateCounty()))
    { errorCount += 1; }
    if (!(validatePostcode($('#post_code').attr('id'), $('#post_code').val())))
    { errorCount += 1; }

    if (errorCount > 0)
    {
        return false;
    }
    else
    {
       addressConfirmed();
       return true;
    }
}



function bindUpdateAddressDisplay()
{
    $(".UpdateAddressButton").click(function(e)
    {
        e.preventDefault();
        $('#action').val('addAddress');

        var $addAddressContainer = $(".addAddressContainer");

        $addAddressContainer.find(".addressDetailsSection").hide();
        $addAddressContainer.find("#divPAFError").hide();
        $addAddressContainer.find("#addressInputSection").show();
        $addAddressContainer.lightbox_me({
            centered: true,
            closeClick: true,
            closeEsc: true,
            destroyOnClose : false,
            closeSelector  : ".closeButton"
        });
    });
}

window.addEventListener('evripsf-parcelshop_selected', (e: CustomEvent) => {
    const parcelShopIdElem = document.getElementById('selectedParcelShopID') as HTMLFormElement || false;
    const parcelShopNameElem = document.getElementById('selectedParcelShopName') as HTMLFormElement || false;
    const parcelShopStreetElem = document.getElementById('selectedParcelShopStreet') as HTMLFormElement || false;
    const parcelShopCityElem = document.getElementById('selectedParcelShopCity') as HTMLFormElement || false;
    const parcelShopPostcodeElem = document.getElementById('selectedParcelShopPostCode') as HTMLFormElement || false;
    const actionElem = document.getElementById('action') as HTMLFormElement || false;
    const deliveryFormElem = document.getElementById('deliveryForm') as HTMLFormElement || false;

	if (parcelShopIdElem) {
        parcelShopIdElem.value = e.detail.externalId;
    }

	if (parcelShopNameElem) {
        parcelShopNameElem.value = e.detail.description;
    }

	if (parcelShopStreetElem) {
        parcelShopStreetElem.value = e.detail.address.street;
    }

	if (parcelShopCityElem) {
        parcelShopCityElem.value = e.detail.address.city;
    }

	if (parcelShopPostcodeElem) {
        parcelShopPostcodeElem.value = e.detail.address.postCode;
    }

	if (actionElem) {
        actionElem.value = 'selectNewParcelShop';
    }

	deliveryFormElem.submit();
});


$(document).ready(function() {
    $('#changeContactTelephone').click(function(e)
    {
        e.preventDefault();
        $("#contactPhoneNumber").show();
        $("#contactPhoneNumber").parent(".input-wrapper").show();
        $("#existingContactTelephone").hide();
        $(this).hide();

    });

	//Remove the onchange events from the 3 select boxes...
	$("select#selectDelivery,select#selectDate,select#selectDeliveryStated").attr("onchange","");

	$("select#selectDelivery").change(function(){
		$("#delChoiceNextDay").attr("checked","checked");
		$('#action').val('updateDeliveryChoice');
		$('#deliveryForm').submit();
	});

	$("select#selectDate").change(function()
	{
		//console.log($(this).find(":selected").attr("data-stateddayboth"));
		if ($(this).find(":selected").attr("data-stateddayboth") == "SB")
		{
			$("#showStatedDayTimeDropDown").show();
		}
		else
		{
			$("#showStatedDayTimeDropDown").hide();
		}

		$("#delChoiceStatedDay").attr("checked","checked");

		if (!$("#showStatedDayTimeDropDown").is(":visible"))
		{
			$("select#selectDeliveryStated").val("Y");
			$('#action').val('updateDeliveryChoice');
			$('#deliveryForm').submit();
		}
	});

	$("select#selectDeliveryStated").change(function(){
		$("#delChoiceStatedDay").attr("checked","checked");
		$('#action').val('updateDeliveryChoice');
		$('#deliveryForm').submit();
	});

	$('#remove_ADC_checkbox').click(function(e)
	{
        e.preventDefault();

		var strAASize = strAAMasterID = strProdId = "", floatPrice = 0.00, intQty = 1;
		var objAAitem = {};
		var objItemArray = [];
		var objAAbag = {};

		strAAMasterID = "unknown";
		strProdId = $("#ADC_Remove_ItemCode").val();
		strProdId = getItemCodeSuffix(strProdId).item;
		floatPrice = $("#ADC_Remove_ItemPrice").val();

		if (checkConsentAdobe()){
			objAAitem.strAAMasterID = strAAMasterID; //need
			objAAitem.strAAProdID = strProdId.toLowerCase();
			objAAitem.strAAProdSKU = (strProdId + '_' + strAASize).toLowerCase();
			objAAitem.strAAQty = intQty;
			objAAitem.strAASharedInd = "unknown delivery page";
			objAAitem.strAARemovalType = "manual";
			objAAitem.strAASize = strAASize;
			objAAitem.strAAUnitPrice = floatPrice;
			objItemArray.push(objAAitem);
		}

		if (checkConsentAdobe()){
			objAAbag.items = objItemArray;
			if (objAAbag.items.length > 0) {
				objAAbag.strAAEventName = "remove from cart";
				objAAbag.strAAEventAction = "cart_remove";
				AACustomBagEvent(objAAbag);
			}
		}

		$('#action').val('deleteADCItems');
		$('#deliveryForm').submit();
		return false;
	});

	var blnADCAdding = false;
	$('#addADCitem').click(function(e)
	{
        e.preventDefault();
		if (blnADCAdding == false)
		{
			var strAASize = strAAMasterID = strProdId = "", floatPrice = 0.00, intQty = 1;
			var objAAitem = {};
			var objItemArray = [];
			var objAAbag = {};

			strAAMasterID = "unknown";

			if(strProdIdLM.length > 0)
			{
				strProdId = strProdIdLM;
				floatPrice = floatPriceLM;
			}
			else
			{
				strProdId = $("#ADC_Add_ItemCode").val();
				floatPrice = $("#ADC_Add_ItemPrice").val();
			}

			strProdId = getItemCodeSuffix(strProdId).item;

			if (checkConsentAdobe()){
				objAAitem.strAAMasterID = strAAMasterID; //need
				objAAitem.strAAProdID = strProdId.toLowerCase();
				objAAitem.strAAProdSKU = (strProdId + '_' + strAASize).toLowerCase();
				objAAitem.strAAQty = intQty;
				objAAitem.strAASharedInd = "unknown delivery page";
				objAAitem.strAAPFM = "ADP Add Delivery";
				objAAitem.strAASize = strAASize;
				objAAitem.strAAUnitPrice = floatPrice;
				objItemArray.push(objAAitem);
			}

			blnADCAdding = true;
			$(this).closest("a").addClass("pointerEventsNone");
			$(this).addClass("ADC-AddingToBag");
			var addAdc = $.ajax
			({
				url         : "/web/main/addAdcToBag.asp",
				type        : 'GET',
				cache       : false
			});
			addAdc.done(function(response)
			{
				if (checkConsentAdobe()){
					objAAbag.items = objItemArray;
					objAAbag.strAAEventName = "add to cart";
					objAAbag.strAAEventAction = "cart_add";
					AACustomBagEvent(objAAbag);
				}
				window.location.reload();
			});
		}
	});

	$("html").on("click", ".ADC-LearnMoreContainer #DeliveryADC-AddToBagContainer a", function(e)
	{
		e.preventDefault();
		if (blnADCAdding == false)
		{
			$(this).find(".ADC-LMC-AddToBag").addClass("ADC-AddingToBag");
			strProdIdLM = $("#ADC_Add_ItemCode_LM").val();
			floatPriceLM = $("#ADC_Add_ItemPrice_LM").val();
			$('#addADCitem').click();
		}
	});

	$(".ADC-LearnMoreText").click(function(e)
	{
		e.preventDefault();

		if (blnADCLearnMoreShowing == false)
		{
			blnADCLearnMoreShowing = true;

			AdobeTrackEvent('event');
			$('.ADC-LearnMoreContainer').lightbox_me({
				centered: true,
				closeClick: false
			});
		}
	});

    $("#applybutton").click(function(e)
    {
		var allValid = true;

        //If the "Contact Number for this order" field exists then validate it.
        if($("#contactPhoneNumber").length>0 && $("#contactPhoneNumber").is(":visible"))
        {
            e.preventDefault();

            //Check phone number contains only numbers and at least 1 character long
            var enteredNo = $("#contactPhoneNumber").val();
            enteredNo = enteredNo.replace(/ /g, "");

            if(!validateNumeric(enteredNo))
            {
                //Not a valid number
				allValid = false;
                determineErrorDisplay(allValid, $("#contactPhoneNumber").attr("id"));
            }
            else if(enteredNo.length < 10 || enteredNo.length > 11)
            {
                //Not a valid number
				allValid = false;
                determineErrorDisplay(allValid, $("#contactPhoneNumber").attr("id"));
            }
            else if(enteredNo.charAt(0) != "0"){
                //Not a valid number
				allValid = false;
                determineErrorDisplay(allValid, $("#contactPhoneNumber").attr("id"));
            }
            else{
				allValid = true;
                determineErrorDisplay(allValid, $("#contactPhoneNumber").attr("id"));
            }
        }

        //If the "ParcelShop Mobile Number for this order" field exists then validate it.
        if($("#parcelshopMobilePhoneNumber").length>0 && $("#parcelshopMobilePhoneNumber").is(":visible"))
        {
            e.preventDefault();

            //Check phone number contains only numbers and at least 1 character long
            var enteredNo = $("#parcelshopMobilePhoneNumber").val();
            enteredNo = enteredNo.replace(/ /g, "");

            if(!isValidMobilePhoneNumber(enteredNo)){
                //Not a valid number
				allValid = false;
                determineErrorDisplay(allValid, $("#parcelshopMobilePhoneNumber").attr("id"));
            }
            else{
				allValid = true;
                determineErrorDisplay(allValid, $("#parcelshopMobilePhoneNumber").attr("id"));
            }
        }

        //If the "Customer Mobile Number for this order" field exists then validate it.
        if($("#contactMobilePhoneNumber").length>0 && $("#contactMobilePhoneNumber").is(":visible"))
        {
            e.preventDefault();

            //Check phone number contains only numbers and at least 1 character long
            var enteredNo = $("#contactMobilePhoneNumber").val();
            enteredNo = enteredNo.replace(/ /g, "");

            if(!isValidMobilePhoneNumber(enteredNo)){
                //Not a valid number
				allValid = false;
                determineErrorDisplay(allValid, $("#contactMobilePhoneNumber").attr("id"));
            }
            else{
				allValid = true;
                determineErrorDisplay(allValid, $("#contactMobilePhoneNumber").attr("id"));
            }
        }

		if ($('#deliveryInfo').length > 0 && $('#deliveryInfo').is(":visible"))
		{
			if (!isValidDeliveryInstructions($('#deliveryInfo').attr('id'), $('#deliveryInfo').val()))
			{
				//ns_.Form.onFailure(deliveryForm, 'deliveryInfo', 'Error on delivery info');
				allValid = false;
			}
		}

		if($("#other").is(":visible"))
		{
			e.preventDefault();

			if(!isValidSafePlace()){
				allValid = false;
                determineErrorDisplay(allValid, $("#safePlaceOther").attr("id"));
			}
			else{
				allValid = true;
                determineErrorDisplay(allValid, $("#safePlaceOther").attr("id"));
			}
		}

		$(".tradePlaceContainer").each(function()
		{
			e.preventDefault();

			var $this = $(this);

			determineErrorDisplay(true, $this.find(".DeliverySlotSelect").attr("id"));
			var strErrorField = $this.find(".DeliverySlotSelect").attr("id");

			if ($this.find(".DeliverySlotSelect").val() == "")
			{
				if (!$this.find("input[name=tradePlaceNoDateSelected]").is(":checked"))
				{
					allValid = false;
					//ns_.Form.onFailure(deliveryForm, strErrorField, 'Error on slot selection');
					determineErrorDisplay(allValid, $this.find(".DeliverySlotSelect").attr("id"));
				}
			}
		});

		$(".tradePlaceConnectionRemovalContainer").each(function()
		{
			e.preventDefault();

			var $this = $(this);

			determineErrorDisplay(true, $this.find(".tradeplaceRadioWrapperSpanChoice").attr("id"));
			var strErrorField = $this.find(".tradePlaceRadioButtonChoice").attr("name");

			if($($this).is(":visible"))
			{
				var $radioButtonValidation = $this.find(".tradePlaceRadioButtonChoice");

				if (!$($radioButtonValidation).is(":checked"))
				{
					allValid = false;
					//ns_.Form.onFailure(deliveryForm, strErrorField, 'Error on connection');
					determineErrorDisplay(allValid, $this.find(".tradeplaceRadioWrapperSpanChoice").attr("id"));
				}
			}
		});

		if (allValid) {
			$('#action').val('yes');
			$('#deliveryForm').submit();
		}
    });


	$("#parcelShopMoreInfoLink").click(function(e){
        e.stopPropagation();
		$('#moreInfoParcelShop').lightbox_me({
			centered: true,
			closeClick: true,
			closeEsc: true,
			modalCSS: {bottom: '0px'}
		});
	});

	// Bind click event to close the iframe.
	$("#moreInfoParcelShop .closeContainer span").on("click", function()
	{
		$('#moreInfoParcelShop').trigger('close');
	});

	$("#parcelShopNoMapMoreInfoLink").click(function(e){
        e.stopPropagation();
		$('#moreInfoParcelShopNoMap').lightbox_me({
			centered: true,
			closeClick: true,
			closeEsc: true,
			modalCSS: {bottom: '0px'}
		});
	});

	$(".parcelShopAvailableMsg a").click(function(e){
        e.stopPropagation();
		$('#moreInfoParcelShopNoMap').lightbox_me({
			centered: true,
			closeClick: true,
			closeEsc: true,
			modalCSS: {bottom: '0px'}
		});
	});

	// Bind click event to close the iframe.
	$("#moreInfoParcelShopNoMap .closeContainer span").on("click", function()
	{
		$('#moreInfoParcelShopNoMap').trigger('close');
	});

	$('#showMultiDeviceItems').lightbox_me({
        centered: true,
        closeClick: false,
        closeEsc: false,
        modalCSS: {bottom: '0px'},
        onLoad : function()
        {
            var multiDeviceStyleForScrolling =  $(".multiDeviceStyleForScrolling");
            if (multiDeviceStyleForScrolling.length > 0)
            {
                if (multiDeviceStyleForScrolling.height() > 340)
                {
                    $('.multiDeviceStyleForScrolling').slimScroll({ height: '350px', alwaysVisible : true, distance: '0px', size: '5px' });
                }
             }
        }
	});

	// Bind click event to close the iframe.
	$("#showMultiDeviceItems .closeContainer span").on("click", function()
	{
        $('#actionMultiDevice').val('multiDeviceUpdate');
		CheckMultiDeviceRemoves();
		$('#multiDeviceForm')[0].submit();
	});

    $('#continueMultiDevice').click(function(event) {
		event.preventDefault();
        $('#actionMultiDevice').val('multiDeviceUpdate');
		CheckMultiDeviceRemoves();
		$('#multiDeviceForm')[0].submit();
    });

    $(".multiDeviceItemsContainer .multiDeviceRemoveContainer").click(function()
    {
        var $this             = $(this);
        var $removeCheckbox   = $this.find("input");
        var orderLineLinkCode = $removeCheckbox.attr("data-linkcode");
        var itemType          = $removeCheckbox.attr("data-itemtype");
        var doIterate  = false;
        var blnChecked = true;

        $removeCheckbox.attr("checked", "checked");
        $this.closest(".multiDeviceRow").fadeOut("400", function()
        {
            if ($(".multiDeviceRow:visible").length == 0)
            {
                $('#actionMultiDevice').val('multiDeviceUpdate');
				CheckMultiDeviceRemoves();
                $('#multiDeviceForm')[0].submit();
            }
        });

        if (itemType == "I") {
            if (orderLineLinkCode.length > 0)
            {
                if ($removeCheckbox.attr("checked") != "checked")
                {
                    blnChecked = false;
                }
                doIterate = true;
            }
        }

        if (doIterate)
        {
            // Iterate through each element with the same link code class.
            $("." + orderLineLinkCode).each(function()
            {
                $(this).attr("checked", blnChecked);
                $(this).closest(".multiDeviceRow").fadeOut("400", function()
                {
                    if ($(".multiDeviceRow:visible").length == 0)
                    {
                        $('#actionMultiDevice').val('multiDeviceUpdate');
						CheckMultiDeviceRemoves();
                        $('#multiDeviceForm')[0].submit();
                    }
                });
            });
        }
    });

	if(typeof window.loadParcelshopFinder != "undefined"){
		var myInterval = setInterval(function(){
			if(typeof $ != "undefined"){
				clearInterval(myInterval);

				$("#parcelShopPostCodeLink").click(function(){
					$("#findNearestParcelShop #hermespsf_mapContainer").empty();

					$('#findNearestParcelShop').lightbox_me({
						centered: true,
						closeClick: true,
						closeEsc: true,
						modalCSS: {bottom: '0px'},
						onLoad  : function() {
							window.loadParcelshopFinder({
								infoPane : true,
								search : true,
								selectable : true,
								directDelivery : true,
								clientUse : true,
								searchTerm : $("#parcelShopPostCode").length > 0 ? $("#parcelShopPostCode").val() : $("#parcelShopPostCodeLink").attr("href").replace("#hermespsf_search=",""),
								containerElement : "#hermespsf_mapContainer"
							});
						}
					});

				});

				// Bind click event to close the iframe.
				$("#findNearestParcelShop .closeContainer span").on("click", function()
				{
					$('#findNearestParcelShop').trigger('close');
				});
			}
		},500);
	}

	$("body").on("click","#parcelShop-Close",function()
	{
		enableParcelshopNoMapScrolling();
		$('#parcelShopFinder').trigger('close');
	});

	$("#parcelShopPostCodeNoMapLink").click(function(){
		if ( $("#parcelShopPostCode").length > 0 ) {
			$('#parcelShopNoMapPostCode').val($('#parcelShopPostCode').val());
		}

		$('#parcelShopFinder').lightbox_me({
			centered: true,
			closeEsc: false,
			closeClick: false,
			destroyOnClose: false,
			onLoad: function() {
				disableParcelshopNoMapScrolling();
				$('#postcodeSearch').val($('#parcelShopNoMapPostCode').val());
				$("#parcelShopFindButton").click();
			}
		});
	});

	$("body").on("click",".ShopContainer .selectShopLink",function(e) {
		e.preventDefault();
		var $this = $(this);
		var index = $this.attr("data-index");

		//return selected parcelshop elements back to delivery page
		$('#selectedParcelShopID').val($('#shopID_'+index).val());
		$('#selectedParcelShopName').val($('#shopName_'+index).val());
		$('#selectedParcelShopStreet').val($('#shopAddrLine1_'+index).val());
		$('#selectedParcelShopCity').val($('#shopAddrLine2_'+index).val());
		$('#selectedParcelShopPostCode').val($('#shopPostcode_'+index).val());
		$('#action').val('selectNewParcelShop');
		$('#deliveryForm').submit();
	});

    $(".AddressContainer, .DeliveryMethod, .ParcelShopContainer").click(function(e)
    {
        e.stopPropagation();
        var $this = $(this);
        $this.find(".radio-wrapper input").attr("checked", "checked");
        $this.find(".radio-wrapper input").click();
    });

    $(".ParcelShopContainer, .ParcelShopContainer .radio-outer-wrapper, .ParcelShopContainer .radio-wrapper")
        .not(".ParcelShopDeSelectContainer, .ParcelShopDeSelectContainer .radio-outer-wrapper, .ParcelShopDeSelectContainer .radio-wrapper, .ParcelShopSelectContainer, .ParcelShopSelectContainer .radio-outer-wrapper, .ParcelShopSelectContainer .radio-wrapper")
        .click(function(e)
    {
        $("#moreInfoParcelShop").trigger("close");
        $("#parcelShopPostCodeLink").click();
    });

    $(".parcelShopMoreInfoImage").click(function(e)
    {
        $("#moreInfoParcelShop").trigger("close");
        $("#parcelShopPostCodeLink").click();
    });

    $(".ParcelShopNoMapContainer, .ParcelShopNoMapContainer .radio-outer-wrapper, .ParcelShopNoMapContainer .radio-wrapper")
        .not(".ParcelShopDeSelectContainer, .ParcelShopDeSelectContainer .radio-outer-wrapper, .ParcelShopDeSelectContainer .radio-wrapper, .ParcelShopSelectContainer, .ParcelShopSelectContainer .radio-outer-wrapper, .ParcelShopSelectContainer .radio-wrapper")
        .click(function(e)
    {
        $("#moreInfoParcelShopNoMap").trigger("close");
        $("#parcelShopPostCodeNoMapLink").click();
    });

    $(".parcelShopNoMapMoreInfoImage").click(function(e)
    {
        $("#moreInfoParcelShopNoMap").trigger("close");
        $("#parcelShopPostCodeNoMapLink").click();
    });


    bindUpdateAddressDisplay();


    // Handle safe place options.
    var safePlaceCode        = $(".safePlaceCodeSession").text();
    var safePlaceDescription = $(".safePlaceDescriptionSession").text();

    if (safePlaceCode != "")
    {
        $("#safePlaceSelect").val(safePlaceCode);
        $("#safePlaceSelect").parent().find(".holder").text(safePlaceDescription);
    }
    if (safePlaceCode == "Z:Other")
    {
        $("#safePlaceOther").show();
        $("#other").show();
        $("#safePlaceOther").val(safePlaceDescription);
        $("#safePlaceSelect").parent().find(".holder").text("Other (please specify)");
    }
});*/