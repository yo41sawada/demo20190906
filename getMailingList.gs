function main() {
  // FIXME 対象組織を設定
  var targetDomain = 'hogehoge.co.jp'; 

  // FIXME メールに関わる設定
  var mailRecipient = 'yamada.taro@hogehoge.co.jp'; // 送信先メールアドレス
  var mailTitle = '[Execute] メーリングリスト棚卸スクリプト'; // メール件名

  // FIXME Slackに関わる設定（ Incomming Webhook を受信可能な Slack チャンネルの URL ）
  var slackChannelUrl = 
      "https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/aaaaaaaaaaaaaaaaaaaaaaaa"; 
  
  var pageToken;
  var page;
  do {
    page = AdminDirectory.Groups.list({
      domain: targetDomain,
      // maxResults: 100, 
      pageToken: pageToken,
    });

    // グループを取得する
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        // FIXME ログへの出力や項目を変更したければここを修正する
        Logger.log('■ %s %s', group.name, group.email);
        
        // グループごとにメンバーを取得する
        var members = AdminDirectory.Members.list(group.id).members;
        if (members){
          for (var j = 0; j < members.length; j++) {

            // FIXME ログへの出力や項目を変更したければここを修正する
            Logger.log('%s', members[j].email);

          }
        } else {
          Logger.log('No menbers found.');        
        }
        Logger.log('');
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  
  // FIXME 格納する結果を変更したければここを修正する
  var result = Logger.getLog();
  
  // FIXME 送信方式を変更したければここを修正する
  sendMail(mailRecipient, mailTitle, result); // メールを送信
  // sendSlack(slackChannelUrl, result); // slack へ通知
}

function sendMail(recipient, title, body){
  MailApp.sendEmail(recipient, title, body);  
}

function sendSlack(url, text){
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : '{"text":"' + text + '"}'
  };
  UrlFetchApp.fetch(url, options);
}
