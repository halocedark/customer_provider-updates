Translation =  function ()
{
	this.get = () =>
	{
		var LANG = 
		{
			lang: "ar",
			views: 
			{
				pages: 
				{
					customers: 
					{
						sectionTitle: 'الزبائن',
						form01:{
							label01: "اسم الزبون",
							label02: "حساب البريد",
							label03: "مبلغ الاقتطاع الشهري",
							label04: "هل هذه المعاملة مقبولة؟",
							label05: "تاريخ الازدياد",
							submitBTN01: "اظافة المعاملة",
							submitBTN02: "اظافة الى القائمة السوداء"
						},
						title01: "جميع المعاملات",
						btn01: "حذف",
						btn02: "بحث",
						inputPlaceholder01: "بحث...",
						label01: "بحث من تاريخ",
						label02: "الى تاريخ",
						table01: {
							th01: "تحديد الكل",
							th02: "اسم الزبون",
							th03: "حساب البريد",
							th04: "السحب الشهري",
							th05: "حالة عملية",
							th06: "عنوان المورد",
							th07: "تمت الصفقة في",
							th08: "العملية",
							th09: "تاريخ الازدياد"
						}
					},
					settings:
					{
						sectionTitle: "إعدادات",
						btn01: "	إعدادت الحساب",
						form01: {
							label01: "اسم",
							label02: "الولاية",
							label03: "البلدية",
							label04: "العنوان",
							label05: "الهاتف",
							label06: "كلمة المرور",
							label07: "تأكيد كلمة المرور",
							submitBTN01: "تحديث الاعدادات"
						},
						form02:
						{
							label01: "حدد لغة العرض",
							submitBTN01: "تحديث الاعدادات"
						},
						btn02: "اعدادات العرض"
					},
					facilities:
					{
						sectionTitle: "التقسيط",
						form01: {
							label01: "من تاريخ",
							label02: "الى تاريخ",
							select01: {
								option01: "سحب",
								option02: "ضريبة",
								option03: "موقف",
								option04: "ملف ناقص",
								option05: "ضريبة بدون سحب",
								option06: "الكل"
							},
							select02: {
								option01: "عدد النتائج المعروضة",
							},
							btn01: "بحث",
						},
						btn01: "تصدير الجدول ك:",
						title01: "المبلغ الإجمالي",
						title02: "مفتاح الجدول",
						text01: "ضريبة",
						text02: "سحب",
						text03: "موقف",
						text04: "ملف ناقص"
					}
				},
				dialogs:
				{
					dialog_box:{
						btn01: "اغلاق"
					},
					promptConfirmDialog:
					{
						btn01: "حسنا",
						btn02: "اغلاق"
					},
					promptInputDialog:
					{
						btn01: "حسنا",
						btn02: "اغلاق"
					}
				},
				addons:{
					userAuth:
					{
						title01: "تسجيل حساب",
						form01: {
							label01: "اسم المزود",
							label02: "هاتف",
							label03: "كلمة المرور",
							label04: "الولاية",
							label05: "البلدية",
							label06: "العنوان",
							submitBTN01: "تسجيل حساب",
							formText01: "تسجيل الدخول"
						},
						title02: "تسجيل الدخول",
						form02: {
							label01: "هاتف",
							label02: "كلمة المرور",
							submitBTN01: "تسجيل الدخول",
							formText01: "انشاء حساب"
						}
					}
				},
				partials:
				{
					sidebar: {
						nav01: "اظافة معاملة",
						nav02: "التقسيط",
						nav03: "الاعدادات",
						nav04: "تحقق من وجود تحديثات",
						nav05: "تسجيل الخروج",
						text01: "جميع الحقوق محفوظة من طرف شركة Holoola-z © 2022",
						text02: "تواصل معنا عبر الهاتف:"
					}
				}
			}
		}

		return LANG;
	}
};

module.exports = Translation;