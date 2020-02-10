+++
title = "JSON-LDによるブログの構造化データをHugoで実現する"
+++
このブログをJSON-LDで構造化データとして表現できるようにいろいろいじりました。使用した語彙は[schema.org](http://schema.org)です。
また、Hugoにてメタデータの動的生成する方法を紹介しようと思います。

## 構造化データ？schema.org?
構造化データとは、 **Webサイトのコンテンツやメタデータを表現すること** です。この構造化データには  **検索結果にリッチスニペットを適用させる** 、 **Webサイトに意味をもたせることで機械が理解し、処理することができる** という2種類の目的があります。今回私が本ブログの構造化データを行なう目的は後者が大きいです。詳しくは『[「構造化データ」がよく分かる！初心者向け徹底解説++SEOHACKS公式ブログ](http://www.seohacks.net/blog/html_css/kouzoukadata/)』にて詳しく書かれておりますので、そちらをご覧ください。

この構造化データに欠かせないのはメタデータです。つまり、 **このブログを書いた人はmizukmbというユーザです**という情報を機械が理解できるようにしなければなりません。これらを表現するために必要な語彙をschema.orgでは全世界に向けて公開・整備しています。より技術的な話をすると、schema.orgはそれぞれの語彙全てに対してURLを提供しており、機械はそのURLに問い合わせることで意味を理解しています。

かなり雑ですが、まとめると構造化データはWebサイトに意味をもたせようという考え方であり、shcema.orgはそれを実現するための技術的な手段ということです。

## JSON-LD以外にも構造化データを表現する方法はある
JSON-JDとは **構造化データをJSON形式で記述できる書き方** のことです。今回はこちらで構造化データを表現しました。
JSON-LD以外にもRDFaやmicroformatsといった別の書き方もありますが、今回選んだ理由として

1. タグに埋め込む形式ではないのでコンテンツとメタデータを分離して管理できる
2. GoogleがJSON−LDを一番推している（[IntroductiontoStructuredData](https://developers.google.com/search/docs/guides/intro-structured-data#structured-data-guidelines)）

からです。ただ、コンテンツとは別にメタデータを記述するので冗長性が増し、ファイルサイズが大きくなってしまう欠点があります。
一長一短ではありますが、コードの読みやすさで言えば個人的にはJSON−LDが一番良いと思います。

## HugoでJSON−LDを作成する
多くの場合はHugoに組み込みで備わっている[Variables](https://gohugo.io/templates/variables)で事足りますが、それだけではうまくいかないこともあります。
schema.orgではブログを構造化データにするときのTypeは[Blog](http://schema.org/Blog)や[BlogPosting](http://schema.org/BlogPosting)を用いることが多いですが、ブログのコンテンツを表す[headline](http://schema.org/headline)はGoogleの推奨では110文字以内と定められています。
ですので、この要件を満たすためにHugoの関数機能（[functions](https://gohugo.io/templates/functions/)）を使います。

まず、HTMLタグを消してコンテンツをプレーンテキスト化するために[plainify](https://gohugo.io/templates/functions#plainify)を使います。このfunctionは[v1.6](https://github.com/spf13/hugo/releases/tag/v0.16)から追加された新機能ですので、手元のHugoのバージョンが低い場合は最新にアップデートしておいて下さい。Homebrewで入れた人は恐らく1.5だと思います（2016年7月2日時点）

```bash
$ hugo version
Hugo Static Site Generator v0.16 BuildDate: 2016-06-06T21:29:38+09:00
```

ブログのコンテンツは `{{ .Content }}` で取得できます。

```
{{ .Content | plainify }}
```

あとはこれを110文字以内で切り抜きます。[substr](https://gohugo.io/templates/functions#substr)で範囲指定で文字を切り取れますのでこちらを使用します。

```
{{ substr (.Content | plainify) 0 110 }}
```

これでオッケーです。
改行文字 `\n` が気になる人は以下のように[replace](https://gohugo.io/templates/functions#replace)を使って削除すると良いかもしれません。

```
{{ substr (replace (.Content | plainify) "\n" "") 0 110 }}
```

完全なJSON−LDは以下を参照下さい。

<script src="https://gist.github.com/mizukmb/76cfbeb6bc2a6ec51de88e7c24731c26.js"></script>

構造としては全てのページにはBlogの構造化データを付与し、ブログの各コンテンツページのみBlogPostingを追加で付与する形としました。
与えているメタデータですが、[構造化データテストツール](https://search.google.com/structured-data/testing-tool/u/0/)というGoogleが提供するテストツールで怒られないくらいの設定をしました。つまり『必須』のメタデータ+推奨するメタデータと自分で適当に選んだメタデータです。もちろんこれが正しいというわけではなく、まあこのくらいあればいいだろハハハって感じに選びました。

## 今後の展望
画像周りはかなりテキトーなやつを渡しているので適切な画像を渡すようにしたいのと、これでもテストツールでいくつか怒られている箇所があるのでそこを修正したいです。dataModifiedとか入れてないし……

## 参考
[JSON-LDでschema.orgの構造化データ導入をより簡単に](https://w3g.jp/blog/schema-org_and_json-ld)

