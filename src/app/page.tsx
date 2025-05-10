import React from 'react';
import Image from 'next/image';
import { DotsThree, X, Asterisk } from '@phosphor-icons/react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'HowToCook - Recipe',
  description: 'Detailed recipe instructions for 酸梅汤（半成品加工）',
};

const recipeData = {
  pageTitle: "How to cook:",
  recipeName: "酸梅汤（半成品加工）",
  recipeLink: "https://github.com/Anduin2017/HowToCook/blob/master/dishes/drink/%E9%85%B8%E6%A2%85%E6%B1%A4%EF%BC%88%E5%8D%8A%E6%88%90%E5%93%81%E5%8A%A0%E5%B7%A5%EF%BC%89.md",
  imageUrl: "https://picsum.photos/332/131",
  imageAiHint: "chinese plum soup",
  description: "砂糖椰子冰沙是一种制作极其快速方便的饮料，若原料选择得当则口感丰富。然而制作时动静较大，适合白天在家制作以作为下午茶。",
  difficultyLabel: "预估烹饪难度：",
  materialsTitle: "必备原料和工具",
  materials: [
    "酸梅晶固体饮料",
    "方糖（可选）",
    "北京二锅头酒（可选）",
  ],
  calculationsTitle: "计算",
  calculations: [
    "一杯分量，约 350 毫升（含冰）",
    "",
    "金酒 30~40 毫升",
    "汤力水气泡水 1 罐",
    "柠檬 1 个",
    "冰块 100 克",
  ],
  procedureTitle: "操作",
  procedure: [
    "<strong>柠檬的处理</strong>",
    "",
    "1 将柠檬对半切（刀方向垂直于柠檬的头尾连线），并从其中的",
    "&nbsp;&nbsp;一半中切取一片柠檬备用",
    "2 再次将柠檬对半切，将得到的 4 角柠檬用压汁器压出柠檬汁置",
    "&nbsp;&nbsp;于容器中备用",
    "",
    "<strong>正式调配</strong>",
    "",
    "1 选择一个杯子，建议使用容量在 350~400 毫升的透明玻璃杯",
    "2 将 100 克冰块放置在杯底",
    "3 倒入 30~40 毫升金酒",
    "4 倒入 15 毫升柠檬汁（如果喜酸可以加多点或全加）",
    "5 用勺子搅拌均匀",
    "6 将之前准备的一片柠檬放置好",
    "7 缓慢沿杯壁注入汤力水直至满杯（不要倒在冰上，避免起泡流失）",
    "8 用勺子轻轻上下提拉将液体搅拌均匀（不要旋转搅拌，避免起泡流失）",
    "9 在液面放置好装饰用的绿叶（可选）",
  ],
  extraInfoTitle: "附加内容",
  extraInfo: [
    "如果没有准备方糖或北京二锅头，可以省略操作中的第 4 步或第 5 步。",
    "放入冰箱冷藏后再饮用效果更佳。",
    "饮酒请勿驾车。",
    "如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。",
  ],
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleContainerClassName?: string;
  contentContainerClassName?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, titleContainerClassName, contentContainerClassName }) => {
  return (
    <div className="flex flex-col items-start gap-2 self-stretch w-full">
      <div className={cn("text-base font-medium text-foreground", titleContainerClassName)}> {/* text-base is 16px */}
        {title}
      </div>
      <div className="self-stretch w-full h-px bg-foreground" />
      <div className={cn("text-xs font-normal text-foreground leading-relaxed self-stretch", contentContainerClassName)}> {/* text-xs is 12px */}
        {children}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="w-[375px] h-auto border border-solid border-border bg-card text-foreground font-sans mx-auto shadow-lg rounded-md py-4"> {/* Adjusted height to auto and added padding */}
      <div className="flex flex-col w-[332px] items-stretch gap-[7px] relative top-[27px] left-[23px]">
        <div className="self-end">
          <DotsThree size={12} weight="fill" className="text-foreground" />
        </div>

        <div className="flex flex-col items-start gap-5 self-stretch w-full">
          <h2 className="text-[21px] font-normal text-foreground">
            {recipeData.pageTitle}
          </h2>

          <div className="flex flex-col items-start gap-1.5 self-stretch w-full">
            <div className="flex items-center justify-between self-stretch w-full">
              <Link
                href={recipeData.recipeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[27px] font-normal text-foreground hover:underline"
              >
                {recipeData.recipeName}
              </Link>
              <X size={25} className="text-foreground cursor-pointer" />
            </div>
            <div className="self-stretch w-full h-px bg-foreground" />
          </div>
          
          <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
            <div className="relative self-stretch w-full h-[131px]">
              <Image
                src={recipeData.imageUrl}
                alt={recipeData.recipeName}
                fill // layout="fill" is deprecated, use fill
                style={{ objectFit: 'cover' }} // objectFit="cover" needs to be in style prop with fill
                className="rounded"
                data-ai-hint={recipeData.imageAiHint}
              />
            </div>

            <div className="flex flex-col items-start gap-9 self-stretch w-full">
              <p className="text-xs font-normal text-foreground leading-relaxed self-stretch"> {/* text-xs is 12px */}
                {recipeData.description}
              </p>

              <div className="inline-flex items-center">
                <div className="text-base font-medium text-foreground"> {/* text-base is 16px */}
                  {recipeData.difficultyLabel}
                </div>
                <Asterisk size={21} weight="fill" className="text-foreground ml-1" />
              </div>

              <Section title={recipeData.materialsTitle} titleContainerClassName="w-auto">
                <div>
                  {recipeData.materials.map((item, index) => (
                    <React.Fragment key={index}>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                      {index < recipeData.materials.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </Section>

              <Section title={recipeData.calculationsTitle} titleContainerClassName="w-auto">
                <div>
                  {recipeData.calculations.map((line, index) => (
                    <React.Fragment key={index}>
                      <span dangerouslySetInnerHTML={{ __html: line }} />
                      {(index < recipeData.calculations.length - 1 || line === "") && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </Section>
              
              <Section title={recipeData.procedureTitle} titleContainerClassName="w-auto">
                <div>
                  {recipeData.procedure.map((line, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: line.startsWith('<strong>') ? line : line.replace(/^(\d+\s?)/, '$1').replace(/&nbsp;/g, '\u00A0') }} className="whitespace-pre-wrap"/>
                  ))}
                </div>
              </Section>

              <Section title={recipeData.extraInfoTitle} titleContainerClassName="w-auto">
                <div>
                  {recipeData.extraInfo.map((line, index) => (
                    <React.Fragment key={index}>
                      <span dangerouslySetInnerHTML={{ __html: line }} />
                      {index < recipeData.extraInfo.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
