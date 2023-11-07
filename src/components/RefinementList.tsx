import { useEffect, useState } from 'react';
import { useInstantSearch, useRefinementList } from 'react-instantsearch';
import { Select, SelectTrigger } from '@/components/ui/select';
import CustomSearchBox from './CutomSearchBox';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CATEGORIES, Category } from '@/lib/traits';
import { Checkbox } from './ui/checkbox';

type TraitSelectorProps = {
  category: Category;
  onTraitChange: (trait: string) => void;
  trait: string;
};

const TraitSelector = (props: TraitSelectorProps) => {
  const { category, trait, onTraitChange } = props;

  const [open, setOpen] = useState(false);
  const { items, refine, searchForItems } = useRefinementList({
    attribute: category.key,
    limit: 50, // TODO: Add pagination
    showMoreLimit: 51,
  });

  useEffect(() => {
    if (trait) {
      // Refresh the result when the trait changes
      refine(trait);
    }
  }, [trait, refine]);

  return (
    <>
      <div className="flex items-center space-x-2">
        <Checkbox id="ck-2019" />
        <label
          htmlFor="ck-2019"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Owned a CryptoKitty pre-2019
        </label>
      </div>

      <div className="mt-4 mb-4">OR</div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div>
            <Select>
              <SelectTrigger
                onClick={() => {
                  setOpen(!open);
                }}
                className="w-[180px]"
              >
                {props.trait || 'Select Zora mint'}
              </SelectTrigger>
            </Select>
          </div>
        </DialogTrigger>
        <DialogContent className="p-6 w-[350px] rounded-xl">
          <h4 className="mt-4 mb-4 text-md font-medium leading-none">Choose Zora mint</h4>
          <CustomSearchBox search={searchForItems}> </CustomSearchBox>
          <Separator />
          <p className="text-xs">
            {"Can't find a mint? Submit a request "}
            <a className="underline" href="https://forms.gle/pfTx8GoYt16x7B2Z8" target="_blank">
              here
            </a>
            .
          </p>
          <div className="h-[240px] mt-4 overflow-y-auto">
            {items.map((item, i) => (
              <>
                <div
                  key={i}
                  className="hover:bg-gray-50 hover:cursor-pointer p-4"
                  onClick={() => {
                    onTraitChange(item.label);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </div>
                <Separator className="" />
              </>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type RefinementListProps = {
  mixpanel: any;
  trait: string;
  setTrait: (trait: string) => void;
  setIsEmptyQuery: (isEmptyQuery: boolean) => void;
};

const RefinementList = (props: RefinementListProps) => {
  const { refresh, setIndexUiState, indexUiState } = useInstantSearch();

  const { trait, setTrait, setIsEmptyQuery } = props;

  const _onTraitChange = (trait: string) => {
    props.mixpanel.track('trait select', { trait });
    setTrait(trait);
    setIsEmptyQuery(false);
  };

  useEffect(() => {
    if (trait) {
      setIndexUiState(() => ({
        refinementList: {
          ['mints.title']: [trait],
        },
      }));
    }
  }, [refresh, setIndexUiState, trait]);

  return (
    <>
      <div className="mt-4">
        <TraitSelector
          category={CATEGORIES[0]}
          trait={trait}
          onTraitChange={_onTraitChange}
        ></TraitSelector>
      </div>
    </>
  );
};

export default RefinementList;
