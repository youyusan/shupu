import { structurePromptV1 } from '@/lib/prompts/structure/v1';
import { recommendPromptV1 } from '@/lib/prompts/recommend/v1';
import { DeepSeekProvider } from '@/lib/ai/provider';
import { parseJsonFromLlm } from '@/lib/ai/json-parser';

const rawInput = `我要写一本数字游民背景下面的一个非虚构的纪实作品。背景是这样的，就是我30岁生日之后，感觉这个身体的状态断崖式的下降。然后精神上就是晚上睡不着，经常要熬到三四点之后才睡着，而且必须小说看到精疲力尽了才能睡。然后我就尝试了一个叫做重启人生的方法，通过健身和冥想，解决了这个问题。我还有一个问题，就是我的牙齿。因为长时间不注意刷牙，然后导致了拔了两颗牙齿，然后做了就是感觉30岁之后就有一个断崖式的下降。好在我跑通了一个项目，赚到了几万块钱一个月。但是随着我在重启人生，就是健身冥想的，以及做探索的一段时间之后，发现这个项目的收益也开始下滑。包括我去探索新项目，已经招人，都不能让这个项目起死回生。于是我就决定离开家乡。我是在家里办公的，和我老爸一起做。我要决定离开这个家乡，去外面看一看。那时候正好接触了数字游民这个概念，然后我又去看看有没有适合数字游民去的地方。然后我就收到了一个，在杭州萧山区有一个数字游民的社区，正在招募内测人员。然后我就报名了，就进入了这个社区，成为了一个数字游民。当然我最初的目的是只是想出去看一看，避免闭门造车。想要探索这个事业新的发展。就组织了70多场活动，然后我也在其中打开了自己，然后也组织了很多活动。但是内测完之后呢，就有一大批人就离开了，就只剩下我和一些少数的人留在这里。这就是第一次离别。然后来了一批新的人，我就想着之前的链接有点太浅显了，虽然只是一起做活动。我很开心，但是并没有和人有这个真正的深入的链接。于是我就想着要与社区的朋友进行深度链接。然后，在后续来的人之中，确实也认识了新的朋友，也进行了深度的链接。但他们又陆陆续续的又有人离开了，我也感觉很难受。然后这是第二次离别。然后到第三次之后了，我自己的那个课程，就是我想做一个重启人生的一个知识付费的项目，然后我决定出一套课程，然后我的课程也慢慢的成型了。然后确实成型了。然后在这个过程中，我也心理上得到了很多的成长。有很多成长。于是呢，我也在社区上看到了一对情侣在一起，也意识到自己之前的亲密关系一直是自己的一个问题。然后我开始反思自己的这个亲密关系。然后发现我在社区里确实有喜欢的女生。但是因为之前这个恋爱失败的原因，一直不敢表达心意。然后就是最后两个月，最后一个月的时间，我发现剩下认识的人也要准备走了。于是我就向一个喜欢的女孩表达出了自己对她的那个好感。但是呢，这次离别，然后我也离开了。这个主要就是社区的三次离别，作为一个冲突事件吧。然后自我的成长，作为一个升级。然后我的主要的欲望呢，还是以跑通项目为主，但是我内心就是一步步揭示自己的内心成长吧。到最后，和能正常地向喜欢的人说出好感，这是我最大的一次成长。然后期间我也会闪回一些之前离别的事情。比如说我的那个大伯和奶奶和我母亲其实都是离世的。离世对我影响很大。我也作为这个三次闪回的一个想法。最后然后这本书的名字先暂定为，离别是难免的，但爱可以对齐。因为这也是内测期间有一个女生提出来的，我觉得可以作为这个主题。`;

async function main() {
  const provider = new DeepSeekProvider();

  console.log('=== 步骤1: 结构化 ===\n');
  const sResponse = await provider.chat(
    [{ role: 'system', content: structurePromptV1(rawInput) }],
    { responseFormat: 'json', temperature: 0.3 }
  );
  const idea = parseJsonFromLlm(sResponse.content);
  console.log(JSON.stringify(idea, null, 2));

  console.log('\n=== 步骤2: 推荐 ===\n');
  const rResponse = await provider.chat(
    [{ role: 'system', content: recommendPromptV1(idea) }],
    { responseFormat: 'json', temperature: 0.3 }
  );

  const books = parseJsonFromLlm(rResponse.content);
  console.log('数量:', books.length);
  books.forEach((b: any, i: number) => {
    console.log(`${i + 1}. 《${b.title}》 ${b.author} [${b.direction}]`);
  });
}

main().catch(console.error);
