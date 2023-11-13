import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from '../shared/ingredient.model'
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from 'rxjs';

@Injectable()

export class RecipeService {

  recipesChanges = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe('Tasty Schnitzel', 'A super tasty Schnitzel - just awesome ', 'https://media.istockphoto.com/id/486565658/photo/homemade-breaded-german-weiner-schnitzel.jpg?s=612x612&w=0&k=20&c=TivmuhhNkjkN81NqqqNxvCBJUTuFAU5sj3hC-5zSEWA=',
  //     [new Ingredient('Meat', 1),
  //       new Ingredient('Potato fri', 2),
  //       new Ingredient('Lemon', 1),
  //     ]),
  //   new Recipe('Big Fat Burger', 'What else you need to say ?', 'https://image-cdn.hypb.st/https%3A%2F%2Fhypebeast.com%2Fimage%2F2021%2F07%2Fworlds-most-expensive-de-dalton-golden-boy-hamburger-news-000.jpg?w=960&cbr=1&q=90&fit=max',
  //     [
  //       new Ingredient('Bread', 2),
  //       new Ingredient('Tomato', 1),
  //       new Ingredient('Meat', 1),
  //       new Ingredient('Cheese', 1),
  //       new Ingredient('Cucumber', 4),
  //     ]),
  // ];

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {
  }


  setRecipes(recipe: Recipe[]) {
    this.recipes = recipe;
    this.recipesChanges.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice()
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }


  addIngredientsToShoppingList(ingredients: Ingredient[]) {

    this.slService.addIngredients(ingredients);
  }


  addRecipe(recipe: Recipe) {
  this.recipes.push(recipe);
  this.recipesChanges.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanges.next(this.recipes.slice());
  }



  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanges.next(this.recipes.slice());
  }
}
