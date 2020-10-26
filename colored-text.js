var text = "আমেরিকার মধ্য-পশ্চিমাঞ্চলে অবাক করে দেওয়ার মতো শীত পড়েছে। এতে স্বাভাবিক জীবনযাত্রা প্রায় অচল হয়ে পড়েছে। বহু অঞ্চলেই সরকারি অফিস, স্কুল-কলেজসহ বিভিন্ন প্রতিষ্ঠান বন্ধ ঘোষণা করা হয়েছে। এমনকি ডাক বিভাগের চিঠি বিলও বন্দ রয়েছে ২৯ জানুয়ারি থেকে। এই অঞ্চলের কোনো কোনো অঙ্গরাজ্যে এ বছর দক্ষিণ মেরুর চেয়েও বেশি ঠান্ডা পড়েছে। এরই মধ্যে শিকাগোর দুই বিমানবন্দরের ১ হাজার ৬০০ ফ্লাইট বাতিল করা হয়েছে।স্বাভাবিক অবস্থায় আমেরিকার অন্য অঙ্গরাজ্যের তুলনায় শিকাগোয় শীত ও বরফ দুইই কম পড়ে। কিন্তু এবার চিত্র একেবারেই ভিন্ন। ৩০ জানুয়ারি নর্থ ডাকোটায় তাপমাত্রা ছিল শূন্যের নিচে ৩৭ডিগ্রি সেলসিয়াস। একই দিনে মিনেসোটার তাপমাত্রা ছিল শূন্যের নিচে ৩৪ ডিগ্রি সেলসিয়াস ও শিকাগোতে ৩০ ডিগ্রি সেলসিয়াস। শিকাগোর এই তাপমাত্রা ১৯৬৬ সালের সর্বনিম্ন তাপমাত্রাকেও ছাড়িয়ে গিয়েছে। এ তাপমাত্রা এমনকি আলাস্কাকেও ছাড়িয়ে গেছে। কিন্তু এখনো দুর্ভোগ বাকি। কারণ পূর্বাভাস অনুযায়ী ৩১ জানুয়ারি তাপমাত্রা আরও নামতে পারে।তবে আবহাওয়া অধিদপ্তরের তথ্যমতে, দু-এক দিনের মধ্যেই আবহাওয়ার উন্নতি হবে। ১ ফেব্রুয়ারি থেকে তাপমাত্রা বেড়ে তা দ্রুত শূন্যের ওপর উঠবে বলে আশা করা হচ্ছে। শনিবার থেকে তাপমাত্রা বেড়ে সোমবার নাগাদ স্বাভাবিক অবস্থায় আসবে। তবে এরপরই আবার তাপমাত্রা কমতে শুরু করবে। তবে এত খারাপ অবস্থা আর হবে না বলে আশা করা হচ্ছে।একটা কথা জেনে রাখা ভালো। সুমেরু ও কুমেরু বা উত্তর ও দক্ষিণ মেরুতে ঠান্ডা হলেও কুমেরুতে সুমেরুর চেয়ে ঠান্ডা বেশি। এর কারণ সুমেরুর সমুদ্রটি স্থল বেষ্টিত। অন্য পক্ষে কুমেরুর স্থলটি সমুদ্র দ্বারা বেষ্টিত। সুমেরুর সমুদ্রটি বরফ দ্বারা আচ্ছাদিত হলেও তা তুলনামূলক উষ্ণ।";


function coloringText() {
    var outputBox = document.getElementById("document-view");
    var words = text.split(" ");
    var coloredText = '';
    words.forEach(element => {
        if (element.length > 4) {
            coloredText += '<span style="color: red">' + element + ' </span> '; 
        } else if (element.length > 3) {
            coloredText += '<span style="color: green">' + element + ' </span> '; 
        } else if (element.length > 2) {
            coloredText += '<span style="color: blue">' + element + ' </span> ';
        }
    });
    outputBox.innerHTML = coloredText;
}