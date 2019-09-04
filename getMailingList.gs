function main() {
  // FIXME �Ώۑg�D��ݒ�
  var targetDomain = 'hogehoge.co.jp'; 

  // FIXME ���[���Ɋւ��ݒ�
  var mailRecipient = 'yamada.taro@hogehoge.co.jp'; // ���M�惁�[���A�h���X
  var mailTitle = '[Execute] ���[�����O���X�g�I���X�N���v�g'; // ���[������

  // FIXME Slack�Ɋւ��ݒ�i Incomming Webhook ����M�\�� Slack �`�����l���� URL �j
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

    // �O���[�v���擾����
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];

        // FIXME ���O�ւ̏o�͂⍀�ڂ�ύX��������΂������C������
        Logger.log('�� %s %s', group.name, group.email);
        
        // �O���[�v���ƂɃ����o�[���擾����
        var members = AdminDirectory.Members.list(group.id).members;
        if (members){
          for (var j = 0; j < members.length; j++) {

            // FIXME ���O�ւ̏o�͂⍀�ڂ�ύX��������΂������C������
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
  
  // FIXME �i�[���錋�ʂ�ύX��������΂������C������
  var result = Logger.getLog();
  
  // FIXME ���M������ύX��������΂������C������
  sendMail(mailRecipient, mailTitle, result); // ���[���𑗐M
  // sendSlack(slackChannelUrl, result); // slack �֒ʒm
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
