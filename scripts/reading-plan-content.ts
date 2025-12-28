/**
 * Devotional content for reading plans
 * This content is aligned with biblical principles of wholeness, restoration, and healing
 */

export interface DevotionalContent {
  day: number
  dayTitle: string
  devotional: string // Plain text that will be converted to blocks
  scripture: Array<{
    book: string
    chapter: number
    verse?: number
    startVerse?: number
    endVerse?: number
  }>
}

// Helper to convert plain text to Sanity block format
export function textToBlocks(text: string) {
  const paragraphs = text.split('\n\n').filter((p) => p.trim())
  return paragraphs.map((paragraph, index) => ({
    _type: 'block',
    _key: `block-${index + 1}`,
    children: [
      {
        _type: 'span',
        text: paragraph.trim(),
        _key: `span-${index + 1}-1`,
      },
    ],
    style: 'normal',
    markDefs: [],
  }))
}

// Healing from Shame: 30-Day Journey - Complete Content
export const healingFromShameContent: DevotionalContent[] = [
  {
    day: 1,
    dayTitle: 'Day 1: God Sees You',
    devotional: `Has a traumatic past left you hurting? You might hurt in ways that are very difficult to describe at times, and it may often leave you feeling broken, angry, undeserving, or shameful. However, God promises a bright and abundant future despite your past. You can find hope in God's presence and the Father's unconditional love.

God wants to restore the ability to love yourself again. He is waiting to guide you toward freedom from your pain. Take a step of faith and begin this journey toward healing with a Father who never disappoints.

When the pain of recollection convinces you to deny its toxicity and forestall recovery, you must remember that God has more for your life. He has the strength to guide you through the darkest places into the safety of His arms. Jehovah Rapha, the God who heals, wants to help you fulfill your unique purpose with peace, authority, and freedom!

No, healing will not be an easy journey; there will be tears and frustrations. Fears will surface. Yet, take heart in knowing you are not alone in this battle for your freedom. The Bible says in Colossians 1:13, "God rescued us from dead-end alleys and dark dungeons. He's set us up in the kingdom of the Son he loves so much." You already have victory in Christ, so walk towards that outstanding truth when times get tough along your healing journey.`,
    scripture: [
      { book: 'COL', chapter: 1, verse: 13 },
      { book: 'JER', chapter: 29, verse: 11 },
      { book: 'ISA', chapter: 41, verse: 10 },
      { book: 'JHN', chapter: 10, verse: 10 },
    ],
  },
  {
    day: 2,
    dayTitle: 'Day 2: You Are Not Your Shame',
    devotional: `Shame tells us that we are what happened to us. It whispers that our identity is wrapped up in the abuse, the trauma, the pain. But God's Word tells us something completely different. In Psalm 34:5, we read, "Those who look to him are radiant; their faces are never covered with shame."

We believe in the wholeness of the person—body, mind, and spirit. When trauma occurs, it affects all three. But God's healing power reaches into every part of who you are. You are not defined by what was done to you. You are defined by who God says you are: His beloved child, created in His image, redeemed by His Son.

Today, take a moment to look in the mirror and say, "I am not my shame. I am God's child, and He is healing me." This is not denial—it's truth. The shame you carry is not yours to bear. Jesus already carried it to the cross.`,
    scripture: [
      { book: 'PSA', chapter: 34, verse: 5 },
      { book: 'ISA', chapter: 61, verse: 1 },
      { book: 'ROM', chapter: 8, verse: 1 },
    ],
  },
  {
    day: 3,
    dayTitle: 'Day 3: God\'s Compassionate Heart',
    devotional: `In the story of the woman caught in adultery (John 8:1-11), we see Jesus' response to shame. The religious leaders wanted to stone her, to expose her, to make her pay. But Jesus did something radical: He knelt down and wrote in the dust, then stood and said, "Let any one of you who is without sin be the first to throw a stone at her."

When everyone left, Jesus asked her, "Woman, where are they? Has no one condemned you?" "No one, sir," she replied. "Then neither do I condemn you," Jesus declared. "Go now and leave your life of sin."

Notice what Jesus didn't say: "It's okay, it wasn't that bad" or "Just get over it." He acknowledged her pain, removed her shame, and called her to a new life. This is God's heart for you. He doesn't minimize your trauma, but He does remove the shame that binds you.`,
    scripture: [
      { book: 'JHN', chapter: 8, startVerse: 1, endVerse: 11 },
      { book: 'PSA', chapter: 103, verse: 13 },
      { book: 'LAM', chapter: 3, verse: 22 },
    ],
  },
  {
    day: 4,
    dayTitle: 'Day 4: Beauty from Ashes',
    devotional: `Isaiah 61:1-3 is one of the most powerful passages for those healing from trauma. It begins with Jesus' mission statement: "The Spirit of the Sovereign LORD is on me, because the LORD has anointed me to proclaim good news to the poor. He has sent me to bind up the brokenhearted, to proclaim freedom for the captives and release from darkness for the prisoners."

The passage continues with a promise that speaks directly to your heart: "to bestow on them a crown of beauty instead of ashes, the oil of joy instead of mourning, and a garment of praise instead of a spirit of despair."

God doesn't just want to heal you—He wants to transform your pain into purpose. The ashes of your past can become a crown of beauty. Your mourning can turn to joy. Your despair can become praise. This is not wishful thinking; it's God's promise to you.

We believe in the restoration of all things. Your healing is part of that restoration. God is making all things new, including you.`,
    scripture: [
      { book: 'ISA', chapter: 61, startVerse: 1, endVerse: 3 },
      { book: 'REV', chapter: 21, verse: 5 },
      { book: '2CO', chapter: 5, verse: 17 },
    ],
  },
  {
    day: 5,
    dayTitle: 'Day 5: The God Who Weeps With You',
    devotional: `When Lazarus died, Jesus didn't just show up and fix everything immediately. First, He wept. John 11:35 is the shortest verse in the Bible: "Jesus wept." But it's also one of the most profound.

Jesus, who knew He was about to raise Lazarus from the dead, still wept. He felt the pain of Mary and Martha. He felt the brokenness of a world where death and pain exist. He entered into their suffering.

This is the God you serve—a God who doesn't stand aloof from your pain but enters into it. He weeps with you. He feels your shame, your anger, your confusion. He doesn't minimize it or tell you to "just have faith." He sits with you in the darkness.

As you continue this journey, remember: God is not distant from your pain. He is Emmanuel—God with us. Even in your darkest moments, He is there, weeping with you, holding you, and working for your healing.`,
    scripture: [
      { book: 'JHN', chapter: 11, startVerse: 32, endVerse: 36 },
      { book: 'PSA', chapter: 56, verse: 8 },
      { book: 'HEB', chapter: 4, verse: 15 },
    ],
  },
  {
    day: 6,
    dayTitle: 'Day 6: Your Body Is a Temple',
    devotional: `We believe in the wholeness of the person. Your body is not separate from your spirit—they are interconnected. When trauma happens, it affects your entire being.

1 Corinthians 6:19-20 reminds us: "Do you not know that your bodies are temples of the Holy Spirit, who is in you, whom you have received from God? You are not your own; you were bought at a price. Therefore honor God with your bodies."

This verse isn't about shame over your body. It's about recognizing that your body is sacred, valuable, and worthy of care. The trauma you experienced was a violation of that sacredness. But God wants to restore it.

Your body may carry scars, both visible and invisible. But those scars don't define you. They are part of your story, but they are not the end of your story. God is healing your body, your mind, and your spirit. Honor your body by allowing God to heal it.`,
    scripture: [
      { book: '1CO', chapter: 6, startVerse: 19, endVerse: 20 },
      { book: 'PSA', chapter: 139, verse: 14 },
      { book: 'ROM', chapter: 12, verse: 1 },
    ],
  },
  {
    day: 7,
    dayTitle: 'Day 7: The Power of Truth',
    devotional: `Shame thrives in darkness. It whispers, "Don't tell anyone. They won't understand. They'll judge you." But truth brings light, and light brings healing.

Jesus said in John 8:32, "Then you will know the truth, and the truth will set you free." The truth is: what happened to you was wrong. The truth is: it wasn't your fault. The truth is: you are not alone. The truth is: God loves you and wants to heal you.

We value truth. We believe in the truth of Scripture, the truth of God's character, and the truth of our identity in Christ. But we also believe in speaking truth about difficult things—including abuse, trauma, and shame.

If you haven't already, consider telling someone safe about what happened to you. This might be a counselor, a pastor, a trusted friend, or a support group. Speaking the truth breaks shame's power. You don't have to carry this alone.`,
    scripture: [
      { book: 'JHN', chapter: 8, verse: 32 },
      { book: 'EPH', chapter: 4, verse: 25 },
      { book: 'PSA', chapter: 51, verse: 6 },
    ],
  },
  {
    day: 8,
    dayTitle: 'Day 8: Boundaries and Safety',
    devotional: `One of the most important parts of healing is learning to set boundaries. After trauma, you may struggle to know what's safe and what's not. You might swing between being too closed off or too open, too trusting or not trusting at all.

Proverbs 4:23 says, "Above all else, guard your heart, for everything you do flows from it." Setting boundaries isn't about being mean or unloving—it's about protecting the healing work God is doing in you.

We believe in healthy relationships. We believe in community, but we also believe in wisdom. It's okay to say no. It's okay to protect yourself. It's okay to step away from people or situations that trigger your trauma.

God wants you to be safe. He wants you to heal. Sometimes that means creating boundaries that protect your heart while it heals. This is not selfish—it's necessary.`,
    scripture: [
      { book: 'PRO', chapter: 4, verse: 23 },
      { book: 'MAT', chapter: 7, verse: 6 },
      { book: '1TH', chapter: 5, verse: 22 },
    ],
  },
  {
    day: 9,
    dayTitle: 'Day 9: The God Who Remembers',
    devotional: `Sometimes in our pain, we wonder if God has forgotten us. We look at our circumstances and think, "If God really cared, He would have stopped this from happening." But God hasn't forgotten you.

In Isaiah 49:15-16, God asks a powerful question: "Can a mother forget the baby at her breast and have no compassion on the child she has borne? Though she may forget, I will not forget you! See, I have engraved you on the palms of my hands."

God remembers you. He sees you. He knows your pain. And He is working for your healing, even when you can't see it. The scars on Jesus' hands are a reminder that He has not forgotten you. He bore your pain on the cross, and He bears it with you now.

Your healing may take time. It may be messy. But God is with you every step of the way. He has not forgotten you, and He never will.`,
    scripture: [
      { book: 'ISA', chapter: 49, startVerse: 15, endVerse: 16 },
      { book: 'PSA', chapter: 103, verse: 14 },
      { book: 'HEB', chapter: 13, verse: 5 },
    ],
  },
  {
    day: 10,
    dayTitle: 'Day 10: Rest in God\'s Presence',
    devotional: `Healing is exhausting. Some days, you may feel like you can't take another step. That's okay. God doesn't expect you to be strong all the time. In fact, He invites you to rest.

Matthew 11:28-30 says, "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light."

We understand the importance of rest. God set aside the Sabbath as a day of rest and restoration. But rest isn't just for one day a week—it's a posture of the heart. It's trusting that God is working even when you're not.

Today, give yourself permission to rest. You don't have to have it all together. You don't have to be "healed enough." Come to Jesus, just as you are, and find rest for your weary soul.`,
    scripture: [
      { book: 'MAT', chapter: 11, startVerse: 28, endVerse: 30 },
      { book: 'PSA', chapter: 23, startVerse: 1, endVerse: 3 },
      { book: 'EXO', chapter: 33, verse: 14 },
    ],
  },
  {
    day: 11,
    dayTitle: 'Day 11: The God Who Fights for You',
    devotional: `Exodus 14:14 says, "The LORD will fight for you; you need only to be still." When you've been hurt, it's natural to want to fight back, to defend yourself, to make things right. But sometimes, the best thing you can do is be still and let God fight for you.

This doesn't mean you should never speak up or set boundaries. It means that your ultimate vindication comes from God, not from your own efforts. God sees the injustice done to you. He knows the pain you've endured. And He is working for your justice and healing.

We believe in justice. We believe that wrongs will be made right, if not in this life, then in the life to come. But we also believe in God's timing. Sometimes healing comes before justice. Sometimes justice comes in ways we don't expect.

Trust that God is fighting for you. Your job is to rest in His love and continue on the path of healing.`,
    scripture: [
      { book: 'EXO', chapter: 14, verse: 14 },
      { book: 'DEU', chapter: 3, verse: 22 },
      { book: 'PSA', chapter: 35, verse: 1 },
    ],
  },
  {
    day: 12,
    dayTitle: 'Day 12: Your Story Matters',
    devotional: `In Revelation 12:11, we read, "They triumphed over him by the blood of the Lamb and by the word of their testimony." Your story—your testimony—has power. It's not just about what happened to you; it's about how God is healing you.

Shame wants to silence you. It wants you to believe that your story is too ugly, too shameful, too broken to share. But God wants to use your story for His glory. Your healing journey can be a light for others who are walking in darkness.

We value testimony. We share our stories of how God has worked in our lives. Your story of healing from trauma and shame is a powerful testimony of God's grace and healing power.

You don't have to share everything with everyone. But consider sharing your story with someone safe—a counselor, a support group, or a trusted friend. Your story matters, and it can help others find hope.`,
    scripture: [
      { book: 'REV', chapter: 12, verse: 11 },
      { book: 'PSA', chapter: 107, verse: 2 },
      { book: '2CO', chapter: 1, startVerse: 3, endVerse: 4 },
    ],
  },
  {
    day: 13,
    dayTitle: 'Day 13: The God of Second Chances',
    devotional: `Peter denied Jesus three times. He failed spectacularly. But Jesus didn't give up on him. After the resurrection, Jesus restored Peter and gave him a new mission: "Feed my sheep" (John 21:17).

Your past doesn't disqualify you from God's love or God's purpose. You may have made mistakes. You may have been hurt. But God is the God of second chances—and third chances, and fourth chances, and as many chances as you need.

We believe in grace. We believe that God's love is not based on our performance but on His character. You don't have to earn your healing. You don't have to be "good enough" to deserve God's love. You already have it.

Today, let go of the idea that you need to be perfect to be loved. God loves you right now, exactly as you are, in the middle of your healing journey.`,
    scripture: [
      { book: 'JHN', chapter: 21, startVerse: 15, endVerse: 19 },
      { book: 'LUK', chapter: 22, startVerse: 31, endVerse: 32 },
      { book: 'EPH', chapter: 2, verse: 8 },
    ],
  },
  {
    day: 14,
    dayTitle: 'Day 14: Finding Your Voice',
    devotional: `After trauma, you may have lost your voice. You may struggle to speak up, to say no, to express your needs. But God wants to restore your voice. He wants you to speak truth, to set boundaries, to advocate for yourself.

Proverbs 31:8-9 says, "Speak up for those who cannot speak for themselves, for the rights of all who are destitute. Speak up and judge fairly; defend the rights of the poor and needy." This includes speaking up for yourself.

We believe in advocacy. We believe in speaking up for the marginalized, the oppressed, the hurting. But we also believe that you need to advocate for yourself. You need to speak up about what you need, what you want, and what you won't accept.

Your voice matters. Your needs matter. Your boundaries matter. Start small if you need to, but start speaking. Find your voice again.`,
    scripture: [
      { book: 'PRO', chapter: 31, startVerse: 8, endVerse: 9 },
      { book: 'PSA', chapter: 40, verse: 3 },
      { book: 'EPH', chapter: 4, verse: 15 },
    ],
  },
  {
    day: 15,
    dayTitle: 'Day 15: The Power of Community',
    devotional: `Healing doesn't happen in isolation. God created us for community. Ecclesiastes 4:9-10 says, "Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up."

We value community. We gather for worship, for study, for fellowship. But community isn't just about showing up on the Sabbath. It's about finding people who will walk with you through your healing journey.

This might be a support group for trauma survivors. It might be a small group at church. It might be a few trusted friends. But you need people who will listen without judgment, who will support you without trying to fix you, who will be there when healing gets hard.

If you don't have this kind of community yet, pray for it. Ask God to bring people into your life who will support your healing. And be that person for someone else when you're ready.`,
    scripture: [
      { book: 'ECC', chapter: 4, startVerse: 9, endVerse: 10 },
      { book: 'HEB', chapter: 10, startVerse: 24, endVerse: 25 },
      { book: 'GAL', chapter: 6, verse: 2 },
    ],
  },
  {
    day: 16,
    dayTitle: 'Day 16: Forgiving Yourself',
    devotional: `One of the hardest parts of healing can be forgiving yourself. You may blame yourself for what happened, for not speaking up sooner, for trusting the wrong person, for not being "strong enough." But self-forgiveness is an important part of healing.

Colossians 3:13 says, "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you." This includes forgiving yourself.

We believe in forgiveness. We believe that God forgives us, and we're called to forgive others. But we often forget that we also need to forgive ourselves. You are not to blame for what happened to you. You did the best you could with what you had.

Today, extend the same grace to yourself that God extends to you. Forgive yourself for the things you think you should have done differently. You are human, and you are loved.`,
    scripture: [
      { book: 'COL', chapter: 3, verse: 13 },
      { book: 'PSA', chapter: 103, startVerse: 12, endVerse: 13 },
      { book: '1JN', chapter: 1, verse: 9 },
    ],
  },
  {
    day: 17,
    dayTitle: 'Day 17: The God Who Understands',
    devotional: `Hebrews 4:15-16 says, "For we do not have a high priest who is unable to empathize with our weaknesses, but we have one who has been tempted in every way, just as we are—yet he did not sin. Let us then approach God's throne of grace with confidence, so that we may receive mercy and find grace to help us in our time of need."

Jesus understands your pain. He was betrayed, abandoned, abused, and killed. He knows what it's like to suffer unjustly. He knows what it's like to feel alone, to feel shame, to feel broken.

We believe in a God who became human, who experienced our pain, who understands our struggles. You don't have to explain your pain to God—He already understands. You can come to Him with confidence, knowing that He gets it.

Today, bring your pain to Jesus. He understands. He cares. He's there.`,
    scripture: [
      { book: 'HEB', chapter: 4, startVerse: 15, endVerse: 16 },
      { book: 'ISA', chapter: 53, verse: 3 },
      { book: '1PE', chapter: 2, verse: 24 },
    ],
  },
  {
    day: 18,
    dayTitle: 'Day 18: Reclaiming Your Body',
    devotional: `After trauma, you may feel disconnected from your body. You may see it as the enemy, as something that betrayed you, as something that's broken. But your body is not the enemy. It's a temple of the Holy Spirit, and God wants to heal it.

1 Corinthians 6:19-20 reminds us that our bodies are sacred. They're not just containers for our souls—they're part of who we are. We believe in the wholeness of the person. Your body, mind, and spirit are all connected, and God wants to heal all of you.

This might mean taking care of your body through exercise, nutrition, and rest. It might mean seeking medical help for physical symptoms of trauma. It might mean learning to see your body as good and valuable again.

Your body is not broken beyond repair. God is healing it, just as He's healing your mind and spirit. Honor your body by allowing God to heal it.`,
    scripture: [
      { book: '1CO', chapter: 6, startVerse: 19, endVerse: 20 },
      { book: 'PSA', chapter: 139, startVerse: 13, endVerse: 14 },
      { book: 'ROM', chapter: 12, verse: 1 },
    ],
  },
  {
    day: 19,
    dayTitle: 'Day 19: The God Who Restores',
    devotional: `Joel 2:25 says, "I will repay you for the years the locusts have eaten." God doesn't just want to heal you—He wants to restore what was lost. He wants to give you back the years that trauma stole from you.

This doesn't mean you'll forget what happened or that it won't affect you. But it does mean that God can bring good out of even the worst situations. He can use your pain for purpose. He can turn your ashes into beauty.

We believe in restoration. We believe that God is making all things new, including you. Your past doesn't have to define your future. God is restoring you, piece by piece, day by day.

Trust in God's restoration. It may not look like what you expect, but it will be good. He is faithful, and He will complete the work He started in you.`,
    scripture: [
      { book: 'JOE', chapter: 2, verse: 25 },
      { book: 'JER', chapter: 30, verse: 17 },
      { book: 'PSA', chapter: 126, verse: 5 },
    ],
  },
  {
    day: 20,
    dayTitle: 'Day 20: Finding Purpose in Pain',
    devotional: `Joseph said to his brothers, "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives" (Genesis 50:20). Your trauma doesn't have to be the end of your story. God can use it for good.

This doesn't mean that what happened to you was good. It wasn't. But God is so powerful that He can bring good out of even the worst situations. He can use your pain to help others. He can use your healing to bring hope.

We believe in purpose. We believe that God has a plan for each of us, and that plan includes using our experiences—even our pain—for His glory and the good of others.

You may not see the purpose yet. That's okay. But trust that God is working. Your healing journey is not just for you—it's for others who will come after you, who need to see that healing is possible.`,
    scripture: [
      { book: 'GEN', chapter: 50, verse: 20 },
      { book: 'ROM', chapter: 8, verse: 28 },
      { book: '2CO', chapter: 1, startVerse: 3, endVerse: 4 },
    ],
  },
  {
    day: 21,
    dayTitle: 'Day 21: The God Who Never Leaves',
    devotional: `Deuteronomy 31:6 says, "Be strong and courageous. Do not be afraid or terrified because of them, for the LORD your God goes with you; he will never leave you nor forsake you." God has not abandoned you. He is with you in your pain, in your healing, in your journey.

Sometimes, when we're hurting, we feel like God is far away. We wonder if He cares, if He sees, if He's there. But God promises that He will never leave us. He is Emmanuel—God with us—always.

We believe in God's presence. We believe that the Holy Spirit lives in us, that Jesus is with us always, that God is near. Even when you can't feel Him, He's there.

Today, remind yourself: God is with me. He has not left me. He will not forsake me. I am not alone.`,
    scripture: [
      { book: 'DEU', chapter: 31, verse: 6 },
      { book: 'HEB', chapter: 13, verse: 5 },
      { book: 'PSA', chapter: 23, verse: 4 },
    ],
  },
  {
    day: 22,
    dayTitle: 'Day 22: Learning to Trust Again',
    devotional: `After trauma, trust can feel impossible. You may struggle to trust God, to trust others, to trust yourself. But trust is essential for healing. You can't heal in isolation. You need to learn to trust again.

This doesn't mean you should trust everyone or trust blindly. It means learning to trust wisely—to trust people who have earned your trust, to trust God who has proven Himself faithful, to trust yourself as you grow in healing.

Proverbs 3:5-6 says, "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."

We believe in trust. We trust God's Word, we trust His character, we trust His promises. But trust is a choice, and it's a process. Start small. Trust God with one thing today. Then another. Trust will grow as you practice it.`,
    scripture: [
      { book: 'PRO', chapter: 3, startVerse: 5, endVerse: 6 },
      { book: 'PSA', chapter: 37, verse: 3 },
      { book: 'ISA', chapter: 26, verse: 4 },
    ],
  },
  {
    day: 23,
    dayTitle: 'Day 23: The God Who Sees',
    devotional: `Hagar, alone in the desert, called God "El Roi"—the God who sees me (Genesis 16:13). When you feel invisible, forgotten, or unseen, remember: God sees you. He sees your pain. He sees your healing. He sees you.

You may feel like no one understands, like no one sees what you're going through. But God sees. He sees every tear, every struggle, every step forward. He sees you, and He cares.

We believe in a personal God. We believe that God knows us intimately, that He sees us, that He cares about every detail of our lives. You are not invisible to God.

Today, remember: God sees you. He sees your healing journey. He sees your progress, even when it feels slow. He sees you, and He is with you.`,
    scripture: [
      { book: 'GEN', chapter: 16, verse: 13 },
      { book: 'PSA', chapter: 33, verse: 18 },
      { book: 'JOB', chapter: 31, verse: 4 },
    ],
  },
  {
    day: 24,
    dayTitle: 'Day 24: The Power of Prayer',
    devotional: `Philippians 4:6-7 says, "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."

Prayer is not magic. It doesn't make everything better instantly. But it does connect you to God. It does bring peace. It does help you process your pain and find hope.

We believe in prayer. We believe that prayer changes things—not always the circumstances, but always us. Prayer helps us see God's perspective, find peace in the storm, and experience God's presence.

You don't have to have perfect words. You don't have to know what to say. Just talk to God. Tell Him how you feel. Ask for help. Thank Him for what He's doing. Prayer is simply talking to God, and He's always listening.`,
    scripture: [
      { book: 'PHP', chapter: 4, startVerse: 6, endVerse: 7 },
      { book: '1TH', chapter: 5, verse: 17 },
      { book: 'JAM', chapter: 5, verse: 16 },
    ],
  },
  {
    day: 25,
    dayTitle: 'Day 25: The God Who Heals',
    devotional: `Exodus 15:26 says, "I am the LORD, who heals you." God's name is Jehovah Rapha—the God who heals. Healing is not just something God does; it's who He is. He is the healer.

Your healing may take time. It may be messy. It may not look like what you expect. But God is healing you. He is working in your body, your mind, and your spirit. He is making you whole.

We believe in healing. We believe that God heals—sometimes miraculously, sometimes through medicine, sometimes through time and process. But He always heals, in one way or another.

Trust in God's healing. It may not be instant, but it is certain. He is Jehovah Rapha, and He is healing you.`,
    scripture: [
      { book: 'EXO', chapter: 15, verse: 26 },
      { book: 'PSA', chapter: 103, verse: 3 },
      { book: 'JER', chapter: 30, verse: 17 },
    ],
  },
  {
    day: 26,
    dayTitle: 'Day 26: The God Who Provides',
    devotional: `Philippians 4:19 says, "And my God will meet all your needs according to the riches of his glory in Christ Jesus." God will provide what you need for healing—the right counselor, the right support, the right resources, the right timing.

You may feel like you don't have what you need to heal. You may feel like you're missing something—the right help, the right support, the right understanding. But God knows what you need, and He will provide it.

We believe in God's provision. We believe that God provides for our needs—physical, emotional, and spiritual. Trust that He will provide what you need for healing.

Ask God for what you need. Be specific. Then watch as He provides—sometimes in ways you expect, sometimes in ways you don't. But He will provide.`,
    scripture: [
      { book: 'PHP', chapter: 4, verse: 19 },
      { book: 'MAT', chapter: 6, verse: 33 },
      { book: 'PSA', chapter: 23, verse: 1 },
    ],
  },
  {
    day: 27,
    dayTitle: 'Day 27: The God Who Strengthens',
    devotional: `Isaiah 40:31 says, "But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." God will give you the strength you need for healing.

Healing is hard work. It's exhausting. Some days, you may feel like you can't do it anymore. But God promises to give you strength. He promises to renew you when you're weary.

We believe in God's strength. We believe that when we're weak, He is strong. We believe that we can do all things through Christ who strengthens us.

When you're tired, when you're weary, when you feel like you can't go on, remember: God will strengthen you. He will renew you. He will give you what you need to keep going.`,
    scripture: [
      { book: 'ISA', chapter: 40, verse: 31 },
      { book: 'PHP', chapter: 4, verse: 13 },
      { book: '2CO', chapter: 12, verse: 9 },
    ],
  },
  {
    day: 28,
    dayTitle: 'Day 28: The God Who Comforts',
    devotional: `2 Corinthians 1:3-4 says, "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God."

God comforts you so that you can comfort others. Your healing journey is not just for you—it's for others who will come after you, who need to see that healing is possible, who need someone who understands.

We believe in comfort. We believe that God comforts us, and we're called to comfort others. Your pain can become a source of comfort for others.

You may not be ready to help others yet. That's okay. But as you heal, as you grow, you'll be able to comfort others with the comfort you've received. Your story will become a source of hope.`,
    scripture: [
      { book: '2CO', chapter: 1, startVerse: 3, endVerse: 4 },
      { book: 'PSA', chapter: 23, verse: 4 },
      { book: 'ISA', chapter: 51, verse: 12 },
    ],
  },
  {
    day: 29,
    dayTitle: 'Day 29: The God Who Redeems',
    devotional: `Psalm 107:2 says, "Let the redeemed of the LORD tell their story." You are redeemed. You are not what happened to you. You are not your trauma. You are not your shame. You are redeemed by the blood of Jesus, and your story is one of redemption.

Redemption means that God takes what was meant for evil and uses it for good. It means that He takes your pain and turns it into purpose. It means that He takes your brokenness and makes it beautiful.

We believe in redemption. We believe that Jesus redeemed us on the cross, and that redemption is ongoing in our lives. Your healing is part of that redemption.

You are redeemed. Your story is one of redemption. Tell it. Share it. Let others see what God has done in your life.`,
    scripture: [
      { book: 'PSA', chapter: 107, verse: 2 },
      { book: 'GAL', chapter: 3, verse: 13 },
      { book: 'EPH', chapter: 1, verse: 7 },
    ],
  },
  {
    day: 30,
    dayTitle: 'Day 30: The God Who Completes',
    devotional: `Philippians 1:6 says, "Being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus." God started this healing work in you, and He will complete it. He won't give up on you. He won't abandon you. He will finish what He started.

Your healing journey doesn't end here. It's ongoing. But you've taken 30 days to focus on it, to commit to it, to pursue it. And God has been with you every step of the way.

We believe in completion. We believe that God will complete the work He started in us. We believe that one day, when Jesus returns, we will be completely healed, completely whole, completely restored.

Until then, keep going. Keep healing. Keep growing. God is with you, and He will complete what He started. You are not alone. You are loved. You are healing. You are whole in Christ.

Congratulations on completing this 30-day journey. May God continue to heal you, restore you, and use your story for His glory.`,
    scripture: [
      { book: 'PHP', chapter: 1, verse: 6 },
      { book: 'HEB', chapter: 12, verse: 2 },
      { book: 'REV', chapter: 21, startVerse: 4, endVerse: 5 },
    ],
  },
]

// Additional plans content can be added here
// For now, this structure provides the foundation
